/**
 * 财务管理
 */
import React, { useEffect, useRef } from 'react'
import './style.scss'
import moment from 'moment'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateCapitalFlow from '../components/create-capital-flow'
import { DatePicker, Button, Select, Statistic, Input, Form, Popconfirm } from 'antd'
import {
  serviceGetCapitalFlow,
  serviceDeleteCapitalFlow,
  serviceGetCapitalFlowType
} from '@/services'
import { OPTION_TYPES, TypeNames, TYPES } from '../enum'

const { Search } = Input
const { RangePicker } = DatePicker
const Option = Select.Option
const DATE_FORMAT = 'YYYY-MM-DD'

interface State {
  showCreateCapitalFlowModal: boolean
  currentRow: null | { [key: string]: any }
  nameList: any[]
  price: {
    consumption: number
    income: number
    available: number
  }
  sortedInfo: any
  filters: object
}

const initialState: State = {
  showCreateCapitalFlowModal: false,
  currentRow: null,
  nameList: [],
  price: {
    consumption: 0,
    income: 0,
    available: 0
  },
  sortedInfo: null,
  filters: {}
}

const Reminder: React.FC = function() {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()

  const tableColumns = [
    {
      title: '入账时间',
      dataIndex: 'createdAt',
      width: 180,
      sorter: true,
      sortOrder: state.sortedInfo?.field === 'createdAt' && state.sortedInfo.order
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
          {state.filters.price && state.filters.price[0] ? '******' : rowData.__price__}
        </span>
      )
    },
    {
      title: '备注信息',
      render: (rowData: any) => (
        <p className="wspw">{rowData.remarks}</p>
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
    const startDate = moment().startOf('month')
    const endDate = moment().endOf('month')
    setState({ sortedInfo: null })
    form.setFieldsValue({
      keyword: '',
      name: '',
      date: [startDate, endDate]
    })

    if (isGetData !== false) {
      tableRef.current.getTableData()
    }
  }

  // 获取数据
  async function getCapitalFlow(params: { [k: string]: any }) {
    try {
      const values = await form.validateFields()
      params = {
        ...params,
        keyword: values.keyword,
        typeNameId: values.name,
        type: values.type,
        startDate: values.date[0].format(DATE_FORMAT),
        endDate: values.date[1].format(DATE_FORMAT)
      }

      if (state.sortedInfo?.order) {
        params.sort = `${state.sortedInfo.field}-${state.sortedInfo.order.replace('end', '')}`
      }

      return serviceGetCapitalFlow(params).then(res => {
        if (res.data.success) {
          const data = res.data.data

          res.data.data.rows = res.data.data.rows.map((el: any, idx: number) => {
            el.order = idx + 1
            el.createdAt = moment(el.createdAt).format('YYYY-MM-DD HH:mm')
            el.__price__ = TYPES[el.type - 1].symbol + el.price
            el.__color__ = TYPES[el.type - 1].color

            return el
          })

          setState({
            price: {
              income: data.income,
              consumption: data.consumption,
              available: data.available
            }
          })
        }
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
        if (res.data.success) {
          const data = res.data.data
            .map((item: any) => {
              item.optionName = `${TypeNames[item.type]} - ${item.name}`
              return item
            })
            .sort((a: any, b: any) => a.type - b.type)
          setState({ nameList: data })
        }
      })
  }

  function handleActionButton(type: number, row: any) {
    // 编辑
    if (type === 0) {
      setState({ showCreateCapitalFlowModal: true, currentRow: row })
    } else {
      serviceDeleteCapitalFlow(row.id).then(res => {
        if (res.data.success) {
          tableRef.current.getTableData()
        }
      })
    }
  }

  // 时间过滤
  function onFilterDate(type: number) {
    const [startDate] = form.getFieldValue('date')
    const date: moment.Moment[] = [
      moment(moment().format(DATE_FORMAT), DATE_FORMAT),
      moment(moment().format(DATE_FORMAT), DATE_FORMAT)
    ]

    switch (type) {
      case 2:
        const prevDay = moment(
          moment()
            .subtract(1, 'days')
            .format(DATE_FORMAT), DATE_FORMAT
        )
        date[0] = prevDay
        date[1] = prevDay
        break
      case 3:
        date[0] = moment(
          moment()
            .subtract(7, 'days')
            .format(DATE_FORMAT),
          DATE_FORMAT
        )
        date[1] = moment(new Date(), DATE_FORMAT)
        break
      case 4:
        date[0] = moment(
          moment(startDate)
            .subtract(1, 'month')
            .startOf('month')
            .format(DATE_FORMAT),
          DATE_FORMAT
        )
        date[1] = moment(
          moment(startDate)
            .subtract(1, 'month')
            .endOf('month')
            .format(DATE_FORMAT),
          DATE_FORMAT
        )
        break
      case 5:
        date[0] = moment(
          moment(startDate)
            .add(1, 'month')
            .startOf('month')
            .format(DATE_FORMAT),
          DATE_FORMAT
        )
        date[1] = moment(
          moment(startDate)
            .add(1, 'month')
            .endOf('month')
            .format(DATE_FORMAT),
          DATE_FORMAT
        )
        break
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
    setState({ showCreateCapitalFlowModal: false })
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
            <Select>
              <Option value="">全部</Option>
              {state.nameList.map((item: any) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {!form.getFieldValue('name') && (
            <Form.Item
              label="收支类别"
              name="type"
              initialValue=""
            >
              <Select>
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

          <Button type="primary" onClick={tableRef.current?.getTableData}>查询</Button>
          <Button onClick={() => initParams()}>重置</Button>
        </Form>

        <Form
          form={form}
          layout="inline"
          style={{ marginTop: 10 }}
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item
            label="日期"
            name="date"
            initialValue={[]}
          >
            <RangePicker />
          </Form.Item>

          <Button onClick={onFilterDate.bind(null, 1)}>今天</Button>
          <Button onClick={onFilterDate.bind(null, 2)}>昨天</Button>
          <Button onClick={onFilterDate.bind(null, 3)}>最近一周</Button>
          <Button onClick={onFilterDate.bind(null, 4)}>上个月</Button>
          <Button onClick={onFilterDate.bind(null, 5)}>下个月</Button>
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
        onAdd={() => setState({ showCreateCapitalFlowModal: true, currentRow: null })}
      />

      <CreateCapitalFlow
        visible={state.showCreateCapitalFlowModal}
        rowData={state.currentRow}
        nameList={state.nameList}
        onCancel={() => setState({ showCreateCapitalFlowModal: false })}
        onSuccess={handleModalOnSuccess}
      />
    </div>
  )
}

export default Reminder
