/**
 * 日志管理
 */
import React, { useEffect, useRef } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import {
  serviceGetTodoList,
  serviceDeleteTodoList,
  serviceGetAllCompany
} from '@/services'
import { DatePicker, Button, Select, Form, Popconfirm, Dropdown, Menu } from 'antd'
import { FORMAT_DATE, formatDateMinute, DATE_YEAR } from '@/utils'
import { DownOutlined } from '@ant-design/icons'
import { MenuInfo } from 'antd/node_modules/rc-menu/lib/interface'
import { LOG_LIST } from './constants'
import { useHistory } from 'react-router-dom'

const { RangePicker } = DatePicker
const { Option } = Select

interface State {
  companyAll: Record<string, any>[]
}

const initState: State = {
  companyAll: []
}

const LogPage = () => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170
    },
    {
      title: '活动内容',
      dataIndex: 'content',
      className: 'wbba'
    },
    {
      title: '操作',
      width: 250,
      align: 'right',
      fixed: 'right',
      render: (row: Record<string, any>) => (
        <>
          <Button>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            placement="bottomLeft"
            okType="danger"
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  function getData() {
    tableRef.current.getTableData()
  }

  function getTodoList(params: any) {
    const values = form.getFieldsValue()

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }

    return serviceGetTodoList(params).then(res => {
      res.data.data.rows.map((item: any) => {
        item.createdAt = formatDateMinute(item.createdAt)
        return item
      })
      return res
    })
  }

  function initParams() {
    form.resetFields()
    tableRef?.current?.getTableData()
  }

  useEffect(() => {
    initParams()

    serviceGetAllCompany().then(res => {
      const rows = res.data.data.rows
      rows.unshift({
        companyName: '全部',
        id: ''
      })
      setState({ companyAll: rows })
    })
  }, [])

  function handleClickMenu({ key }: MenuInfo) {
    history.push(`/home/log/create/${key}`)
  }

  const menu = (
    <Menu onClick={handleClickMenu}>
      {LOG_LIST.map(item => (
        <Menu.Item key={item.key}>{item.name}</Menu.Item>
      ))}
    </Menu>
  )

  const toolbar = (
    <Dropdown overlay={menu}>
      <Button type="primary">
        新增
        <DownOutlined />
      </Button>
    </Dropdown>
  )

  return (
    <div className="log-page">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item name="company" label="单位" initialValue="">
            <Select style={{ width: 200 }}>
              {state.companyAll.map((item: Record<string, any>) => (
                <Option key={item.id} value={item.id}>{item.companyName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="查询日期" initialValue={DATE_YEAR}>
            <RangePicker allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={getData}>查询</Button>
            <Button onClick={initParams}>重置</Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getTodoList}
        columns={tableColumns}
        toolbar={toolbar}
        onDelete={serviceDeleteTodoList}
      />
    </div>
  )
}

export default LogPage
