/**
 * 财务管理
 */
import React, { useEffect, useRef } from 'react'
import './style.scss'
import dayjs from 'dayjs'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateAmountModal from './CreateAmountModal'
import NumberFlow from '@number-flow/react'
import { DatePicker, Button, Select, Input, Form, Popconfirm } from 'antd'
import {
  serviceGetBill,
  serviceDeleteBill,
  serviceGetBillType,
} from '@/services'
import { OPTION_TYPES, TypeNames, TYPES } from './enum'
import {
  filterOption,
  FORMAT_DATE,
  FORMAT_DATE_MINUTE,
  isToDay,
  isMobile,
} from '@/utils'

const noMobile = !isMobile()

const { Search } = Input
const { RangePicker } = DatePicker
const { Option, OptGroup } = Select

const enum FilterType {
  Today = 1,
  Yesterday,
  LastWeek,
  ThisYear,
  PrevYear,
  PrevMonth,
  NextMonth,
}

const cycleTimes = [
  { type: FilterType.Today, name: '今天' },
  { type: FilterType.Yesterday, name: '昨天' },
  { type: FilterType.LastWeek, name: '最近一周' },
  { type: FilterType.ThisYear, name: '今年' },
  { type: FilterType.PrevYear, name: '上一年' },
  { type: FilterType.PrevMonth, name: '上个月' },
  { type: FilterType.NextMonth, name: '下个月' },
]

interface State {
  showCreateAmountModal: boolean
  currentRow: null | { [key: string]: any }
  amountTypes: any[]
  enterTypes: any[]
  outTypes: any[]
  price: {
    consumptionAmount: number
    incomeAmount: number
    availableAmount: number
  }
  selectedAmount: null | number
}

const initialState: State = {
  showCreateAmountModal: false,
  currentRow: null,
  amountTypes: [],
  enterTypes: [],
  outTypes: [],
  price: {
    consumptionAmount: 0,
    incomeAmount: 0,
    availableAmount: 0,
  },
  selectedAmount: null,
}

const BillPage: React.FC = function () {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>(null)
  const createRef = useRef<any>(null)
  const current = tableRef.current

  const tableColumns: any[] = [
    {
      title: '入账时间',
      dataIndex: 'createdAt',
      width: 180,
      sorter: true,
      sortOrder:
        current?.sorter?.field === 'createdAt' && current?.sorter?.order,
      render: (text: string, rowData: any) => rowData.__createdAt__,
    },
    {
      title: '账单类型',
      dataIndex: 'billType.name',
      width: 120,
      render: (text: string, rowData: any) => rowData.billType?.name,
    },
    {
      title: '收支金额（元）',
      width: 140,
      sorter: true,
      dataIndex: 'price',
      sortOrder: current?.sorter?.field === 'price' && current?.sorter?.order,
      filters: [
        {
          text: '隐藏金额',
          value: false,
        },
      ],
      render: (text: string, rowData: any) => (
        <span style={{ color: rowData.__color__ }}>
          {current?.filters?.price && !current.filters.price[0]
            ? '******'
            : rowData.__price__}
        </span>
      ),
    },
    {
      title: '备注信息',
      render: (rowData: any) => (
        <p className="whitespace-pre-wrap">{rowData.remark}</p>
      ),
    },
    {
      title: '操作',
      width: 180,
      align: 'right',
      fixed: noMobile && 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 0, row)}>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={handleActionButton.bind(null, 1, row)}
            placement="bottomRight"
            okType="danger"
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  function initParams(isGetData?: boolean) {
    const startDate = dayjs().startOf('month')
    const endDate = dayjs().endOf('month')
    form.setFieldsValue({
      keyword: '',
      typeId: 0,
      type: 0,
      date: [startDate, endDate],
      cycle: '',
    })

    if (isGetData !== false) {
      tableRef.current.reset()
      tableRef.current.getTableData()
    }
  }

  // 获取数据
  async function getBill(params: Record<string, any>): Promise<any> {
    try {
      const values = await form.validateFields()
      params = {
        ...params,
        keyword: values.keyword,
        typeId: values.typeId || null,
        type: values.type || null,
      }
      if (Array.isArray(values.date) && values.date.length > 1) {
        params.startDate = values.date[0].format(FORMAT_DATE)
        params.endDate = values.date[1].format(FORMAT_DATE)
      } else {
        form.setFieldsValue({ cycle: '' })
      }

      return serviceGetBill(params).then((res) => {
        res.rows = res.rows.map((el: any, idx: number) => {
          const suffix = isToDay(el.date) ? ' 今天' : ''
          el.order = idx + 1
          el.__createdAt__ = dayjs(el.date).format(FORMAT_DATE_MINUTE) + suffix
          if (el.billType) {
            el.__price__ = TYPES[el.billType.type - 1].symbol + el.price
            el.__color__ = TYPES[el.billType.type - 1].color
          }

          return el
        })

        setState({
          price: {
            incomeAmount: res.incomeAmount,
            consumptionAmount: res.consumptionAmount,
            availableAmount: res.availableAmount,
          },
        })
        return res
      })
    } catch (error) {
      console.error(error)
    }
  }

  // 获取所有类型
  function getBillType() {
    serviceGetBillType().then((res) => {
      const amountTypes = res
        .map((item: any) => {
          item.optionName = `${TypeNames[item.type]} - ${item.name}`
          return item
        })
        .sort((a: any, b: any) => a.type - b.type)
      const enterTypes = amountTypes.filter((item: any) => item.type === 1)
      const outTypes = amountTypes.filter((item: any) => item.type === 2)
      setState({
        amountTypes,
        enterTypes,
        outTypes,
      })
    })
  }

  function handleActionButton(type: number, row: any) {
    // 编辑
    if (type === 0) {
      setState({ showCreateAmountModal: true, currentRow: row })
    } else {
      serviceDeleteBill(row.id).then(() => {
        tableRef.current.getTableData()
      })
    }
  }

  // 时间过滤
  function onFilterDate(type: FilterType) {
    const formDate = form.getFieldValue('date')
    const startDate = formDate ? formDate[0] : new Date()
    const today = dayjs().format(FORMAT_DATE)
    let date: dayjs.Dayjs[] = []

    switch (type) {
      case FilterType.Today:
        date = [dayjs(today, FORMAT_DATE), dayjs(today, FORMAT_DATE)]
        break

      case FilterType.Yesterday:
        const prevDay = dayjs(
          dayjs().subtract(1, 'days').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        date[0] = prevDay
        date[1] = prevDay
        break

      case FilterType.LastWeek:
        date[0] = dayjs(
          dayjs().subtract(7, 'days').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        date[1] = dayjs(today, FORMAT_DATE)
        break

      case FilterType.PrevMonth:
        date[0] = dayjs(
          dayjs(startDate)
            .subtract(1, 'month')
            .startOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE,
        )
        date[1] = dayjs(
          dayjs(startDate)
            .subtract(1, 'month')
            .endOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE,
        )
        break

      case FilterType.NextMonth:
        date[0] = dayjs(
          dayjs(startDate).add(1, 'month').startOf('month').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        date[1] = dayjs(
          dayjs(startDate).add(1, 'month').endOf('month').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        break

      case FilterType.ThisYear:
        date[0] = dayjs(
          dayjs(startDate).startOf('year').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        date[1] = dayjs(
          dayjs(startDate).endOf('year').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        break

      case FilterType.PrevYear:
        date[0] = dayjs(
          dayjs(startDate).subtract(1, 'y').startOf('year').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        date[1] = dayjs(
          dayjs(startDate).subtract(1, 'y').endOf('year').format(FORMAT_DATE),
          FORMAT_DATE,
        )
        break

      default:
        date = []
    }

    form.setFieldsValue({ date })
    tableRef.current?.getTableData()
  }

  function handleModalOnSuccess() {
    setState({ showCreateAmountModal: false })
    tableRef.current.getTableData()
  }

  function onRowSelectionChange(selectedRowKeys: string[], rows: any[]) {
    if (selectedRowKeys.length <= 0) {
      setState({ selectedAmount: null })
      return
    }
    let amount = 0
    selectedRowKeys.forEach((key) => {
      const data = rows.find((item) => item.id === key)
      if (data) {
        if (data.billType.type === 1) {
          amount += Number(data.price)
        } else {
          amount -= Number(data.price)
        }
      }
    })
    amount = Number(amount.toFixed(2))
    setState({ selectedAmount: amount })
  }

  useEffect(() => {
    initParams(false)
    getBillType()
  }, [])

  useEffect(() => {
    const date = form.getFieldValue('date')
    if (date.length <= 0) return
    tableRef?.current?.getTableData()
  }, [])

  return (
    <div className="capital-flow">
      <div className="query-panel">
        <Form form={form} layout="inline">
          <Form.Item label="账务类型" name="typeId">
            <Select className="!w-[150px]" filterOption={filterOption}>
              <Option value={0}>全部</Option>
              <OptGroup label="收入">
                {state.enterTypes.map((item: any) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label="支出">
                {state.outTypes.map((item: any) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </OptGroup>
            </Select>
          </Form.Item>

          {!form.getFieldValue('name') && (
            <Form.Item label="收支类别" name="type">
              <Select className="!w-[150px]" filterOption={filterOption}>
                {OPTION_TYPES.map((item) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item label="" name="keyword">
            <Search
              placeholder="搜索备注"
              maxLength={300}
              onSearch={() => tableRef.current.getTableData()}
              style={{ width: 260 }}
            />
          </Form.Item>
        </Form>

        <Form form={form} layout="inline" className="!mt-2.5">
          <Form.Item label="日期" name="date">
            <RangePicker />
          </Form.Item>

          <Form.Item label="时间段" name="cycle">
            <Select className="!w-[150px]" onSelect={onFilterDate}>
              <Option value="">全部</Option>
              {cycleTimes.map((item) => (
                <Option value={item.type} key={item.type}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" onClick={tableRef.current?.getTableData}>
            查询
          </Button>
          <Button onClick={() => initParams()}>重置</Button>
        </Form>

        <div className="poly">
          <div className="item-amount">
            <NumberFlow prefix="收入：￥" value={state.price.incomeAmount} />
          </div>
          <div className="item-amount">
            <NumberFlow
              prefix="支出：￥"
              value={state.price.consumptionAmount}
            />
          </div>
          <div className="item-amount">
            <NumberFlow
              prefix="实际收入：￥"
              value={state.price.availableAmount}
            />
          </div>
          {state.selectedAmount !== null && (
            <div className="item-amount">
              <NumberFlow prefix="已选择：￥" value={state.selectedAmount} />
            </div>
          )}
        </div>
      </div>

      <Table
        ref={tableRef}
        getTableData={getBill}
        columns={tableColumns}
        onDelete={serviceDeleteBill}
        onRowSelectionChange={onRowSelectionChange}
        onAdd={() =>
          setState({ showCreateAmountModal: true, currentRow: null })
        }
      />

      <CreateAmountModal
        ref={createRef}
        visible={state.showCreateAmountModal}
        rowData={state.currentRow}
        enterTypes={state.enterTypes}
        outTypes={state.outTypes}
        onCancel={() => setState({ showCreateAmountModal: false })}
        onOk={handleModalOnSuccess}
      />
    </div>
  )
}

export default BillPage
