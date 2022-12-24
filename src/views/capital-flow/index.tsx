/**
 * 财务管理
 */
import React, { useEffect, useRef } from 'react'
import './style.scss'
import dayjs from 'dayjs'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateAmountModal from './CreateAmountModal'
import { DatePicker, Button, Select, Statistic, Input, Form, Popconfirm } from 'antd'
import {
  serviceGetCapitalFlow,
  serviceDeleteCapitalFlow,
  serviceGetCapitalFlowType
} from '@/services'
import { OPTION_TYPES, TypeNames, TYPES } from './enum'
import { filterOption, FORMAT_DATE, FORMAT_DATE_MINUTE, isToDay } from '@/utils'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option, OptGroup } = Select

enum FilterType {
  Today = 1,
  Yesterday,
  LastWeek,
  ThisYear,
  PrevMonth,
  NextMonth
}

const cycleTimes = [
  { type: FilterType.Today, name: '今天' },
  { type: FilterType.Yesterday, name: '昨天' },
  { type: FilterType.LastWeek, name: '最近一周' },
  { type: FilterType.ThisYear, name: '今年' },
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
    consumption: number
    income: number
    available: number
  }
  sortedInfo: any
  filters: object
}

const initialState: State = {
  showCreateAmountModal: false,
  currentRow: null,
  amountTypes: [],
  enterTypes: [],
  outTypes: [],
  price: {
    consumption: 0,
    income: 0,
    available: 0
  },
  sortedInfo: null,
  filters: {}
}

const CapitalFlowPage: React.FC = function() {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()

  const tableColumns = [
    {
      title: '入账时间',
      dataIndex: 'createdAt',
      width: 180,
      sorter: true,
      sortOrder: state.sortedInfo?.field === 'createdAt' && state.sortedInfo.order,
      render: (text: string, rowData: any) => rowData.__createdAt__
    },
    {
      title: '账务类型',
      dataIndex: 'name',
      width: 120
    },
    {
      title: '收支金额（元）',
      width: 140,
      sorter: true,
      dataIndex: 'price',
      sortOrder: state.sortedInfo?.field === 'price' && state.sortedInfo.order,
      filters: [
        {
          text: '隐藏金额',
          value: false
        }
      ],
      render: (text: string, rowData: any) => (
        <span style={{ color: rowData.__color__ }}>
          {state.filters.price && !state.filters.price[0]
            ? '******'
            : rowData.__price__}
        </span>
      )
    },
    {
      title: '备注信息',
      render: (rowData: any) => (
        <p className="wspw">{rowData.remark}</p>
      )
    },
    {
      title: '操作',
      width: 180,
      align: 'right',
      fixed: 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 0, row)}>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={handleActionButton.bind(null, 1, row)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  function initParams(isGetData?: boolean) {
    const startDate = dayjs().startOf('month')
    const endDate = dayjs().endOf('month')
    setState({ sortedInfo: null })
    form.setFieldsValue({
      keyword: '',
      name: '',
      type: '',
      date: [startDate, endDate],
      cycle: '',
    })

    if (isGetData !== false) {
      tableRef.current.getTableData()
    }
  }

  // 获取数据
  async function getCapitalFlow(params: Record<string, any>) {
    try {
      const values = await form.validateFields()
      params = {
        ...params,
        keyword: values.keyword,
        typeNameId: values.name,
        type: values.type
      }
      if (Array.isArray(values.date) && values.date.length > 1) {
        params.startDate = values.date[0].format(FORMAT_DATE)
        params.endDate = values.date[1].format(FORMAT_DATE)
      } else {
        form.setFieldsValue({ cycle: '' })
      }

      if (state.sortedInfo?.order) {
        params.sort = `${state.sortedInfo.field}-${state.sortedInfo.order.replace('end', '')}`
      }

      return serviceGetCapitalFlow(params).then(res => {
        res.rows = res.rows.map((el: any, idx: number) => {
          const suffix = isToDay(el.createdAt) ? ' 今天' : ''
          el.order = idx + 1
          el.__createdAt__ = dayjs(el.createdAt).format(FORMAT_DATE_MINUTE) + suffix
          el.__price__ = TYPES[el.type - 1].symbol + el.price
          el.__color__ = TYPES[el.type - 1].color

          return el
        })

        setState({
          price: {
            income: res.income,
            consumption: res.consumption,
            available: res.available
          }
        })
        return res
      })
    } catch (error) {
      console.error(error)
    }
  }

  // 获取所有类型
  function getCapitalFlowType() {
    serviceGetCapitalFlowType()
      .then(res => {
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
          outTypes
        })
      })
  }

  function handleActionButton(type: number, row: any) {
    // 编辑
    if (type === 0) {
      setState({ showCreateAmountModal: true, currentRow: row })
    } else {
      serviceDeleteCapitalFlow(row.id).then(() => {
        tableRef.current.getTableData()
      })
    }
  }

  // 时间过滤
  function onFilterDate(type: FilterType) {
    const formDate = form.getFieldValue('date')
    const startDate = formDate ? formDate[0] : new Date()
    let date: dayjs.Dayjs[] = []

    switch (type) {
      case FilterType.Today:
        date = [
          dayjs(dayjs().format(FORMAT_DATE), FORMAT_DATE),
          dayjs(dayjs().format(FORMAT_DATE), FORMAT_DATE)
        ]
        break

      case FilterType.Yesterday:
        const prevDay = dayjs(
          dayjs()
            .subtract(1, 'days')
            .format(FORMAT_DATE), FORMAT_DATE
        )
        date[0] = prevDay
        date[1] = prevDay
        break

      case FilterType.LastWeek:
        date[0] = dayjs(
          dayjs()
            .subtract(7, 'days')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = dayjs(new Date(), FORMAT_DATE)
        break

      case FilterType.PrevMonth:
        date[0] = dayjs(
          dayjs(startDate)
            .subtract(1, 'month')
            .startOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = dayjs(
          dayjs(startDate)
            .subtract(1, 'month')
            .endOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        break

      case FilterType.NextMonth:
        date[0] = dayjs(
          dayjs(startDate)
            .add(1, 'month')
            .startOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = dayjs(
          dayjs(startDate)
            .add(1, 'month')
            .endOf('month')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        break

      case FilterType.ThisYear:
        date[0] = dayjs(
          dayjs(startDate)
            .startOf('year')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        date[1] = dayjs(
          dayjs(startDate)
            .endOf('year')
            .format(FORMAT_DATE),
          FORMAT_DATE
        )
        break

      default:
        date = []
    }

    form.setFieldsValue({ date })
    tableRef.current?.getTableData()
  }

  function onTableChange(_: unknown, filters: any, sorter: any) {
    setState({
      sortedInfo: {
        field: sorter.field,
        order: sorter.order
      },
      filters
    })
  }

  function handleModalOnSuccess() {
    setState({ showCreateAmountModal: false })
    tableRef.current.getTableData()
  }

  useEffect(() => {
    initParams(false)
    getCapitalFlowType()
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
          <Form.Item
            label="账务类型"
            name="name"
            initialValue=""
          >
            <Select
              className="w150px"
              showSearch
              filterOption={filterOption}
            >
              <Option value="">全部</Option>
              <OptGroup label="收入">
                {state.enterTypes.map((item: any) => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))}
              </OptGroup>
              <OptGroup label="支出">
                {state.outTypes.map((item: any) => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))}
              </OptGroup>
            </Select>
          </Form.Item>

          {!form.getFieldValue('name') && (
            <Form.Item
              label="收支类别"
              name="type"
              initialValue=""
            >
              <Select
                className="w150px"
                showSearch
                filterOption={filterOption}
              >
                {OPTION_TYPES.map(item => (
                  <Option value={item.value} key={item.value}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label=""
            name="keyword"
            initialValue=""
          >
            <Search
              placeholder="试试搜索备注"
              maxLength={300}
              onSearch={() => tableRef.current.getTableData()}
              style={{ width: 260 }}
            />
          </Form.Item>
        </Form>

        <Form
          form={form}
          layout="inline"
          className="mt10"
        >
          <Form.Item
            label="日期"
            name="date"
            initialValue={[]}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item
            label="时间段"
            name="cycle"
            initialValue=""
          >
            <Select
              className="w150px"
              onSelect={onFilterDate}
            >
              <Option value="">全部</Option>
              {cycleTimes.map((item) => (
                <Option value={item.type} key={item.type}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" onClick={tableRef.current?.getTableData}>查询</Button>
          <Button onClick={() => initParams()}>重置</Button>
        </Form>

        <div className="poly">
          <div className="item-price">
            <em>收入：￥</em>
            <Statistic value={state.price.income} precision={2} />
          </div>
          <div className="item-price">
            <em>支出：￥</em>
            <Statistic value={state.price.consumption} precision={2} />
          </div>
          <div className="item-price">
            <em>实际收入：￥</em>
            <Statistic value={state.price.available} precision={2} />
          </div>
        </div>
      </div>

      <Table
        ref={tableRef}
        getTableData={getCapitalFlow}
        columns={tableColumns}
        onTableChange={onTableChange}
        onDelete={serviceDeleteCapitalFlow}
        onAdd={() => setState({ showCreateAmountModal: true, currentRow: null })}
      />

      <CreateAmountModal
        visible={state.showCreateAmountModal}
        rowData={state.currentRow}
        enterTypes={state.enterTypes}
        outTypes={state.outTypes}
        onCancel={() => setState({ showCreateAmountModal: false })}
        onSuccess={handleModalOnSuccess}
      />
    </div>
  )
}

export default CapitalFlowPage
