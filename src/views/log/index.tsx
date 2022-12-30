/**
 * 日志管理
 */
import React, { useEffect, useRef, useMemo } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import DetailDrawer from './DetailDrawer'
import {
  serviceDeleteLog,
  serviceGetLogList
} from '@/services/log'
import { DatePicker, Button, Select, Form, Popconfirm, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { FORMAT_DATE, filterOption } from '@/utils'
import { DownOutlined } from '@ant-design/icons'
import { LOG_LIST } from './constants'
import { useNavigate, Link } from 'react-router-dom'
import { getAllCompany } from '@/store/companySlice'
import { useAppDispatch, useAppSelector } from '@/hooks'

const { RangePicker } = DatePicker
const { Option } = Select

interface State {
  companyAll: Record<string, any>[]
  showDetailDrawer: boolean,
  detail: Record<string, any>
}

const initState: State = {
  companyAll: [],
  showDetailDrawer: false,
  detail: {}
}

const LogPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>()
  const dispatch = useAppDispatch()
  const companyAll = useAppSelector(state => ([
    {
      companyName: '全部',
      id: '-1'
    },
    ...state.company.companyAll
  ]))

  const tableColumns = [
    {
      title: '创建时间',
      dataIndex: '__createdAt__',
      width: 170
    },
    {
      title: '日志类型',
      dataIndex: '__logType__',
      width: 170,
    },
    {
      title: '所属单位',
      dataIndex: 'companyName',
    },
    {
      title: '操作',
      width: 250,
      align: 'right',
      fixed: 'right',
      render: (row: Record<string, any>) => (
        <>
          <Button onClick={() => handlePreview(row)}>详情</Button>

          <Link to={`/home/log/detail/${row.id}`}>
            <Button className="ml10">编辑</Button>
          </Link>

          <Popconfirm
            title="您确定要删除吗？"
            placement="bottomLeft"
            okType="danger"
            onConfirm={() => handleDelLog(row.id)}
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  function handlePreview(record: Record<string, any>) {
    setState({ detail: record })
    toggleDetailDrawer()
  }

  function handleDelLog(logId: string) {
    serviceDeleteLog(logId).then(() => {
      getData()
    })
  }

  function toggleDetailDrawer() {
    setState({ showDetailDrawer: !state.showDetailDrawer })
  }

  function getData() {
    tableRef.current.getTableData()
  }

  function getLogList(params: any) {
    const values = form.getFieldsValue()

    if (values.date?.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }
    params.companyId = values.company
    params.logType = values.logType

    return serviceGetLogList(params)
  }

  function initParams() {
    form.resetFields()
    tableRef?.current?.getTableData()
  }

  useEffect(() => {
    initParams()
    dispatch(getAllCompany())
  }, [])

  function handleClickMenu(key: string) {
    navigate(`/home/log/create/${key}`)
  }

  const items: MenuProps['items'] = useMemo(() => {
    return LOG_LIST.map(item => (
      {
        key: item.key,
        label: (
          <div onClick={() => handleClickMenu(item.key)}>{item.name}</div>
        )
      }
    ))
  }, [LOG_LIST])

  const toolbar = (
    <Dropdown menu={{ items }}>
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
          <div className="w100">
            <div className="flex">
              <Form.Item name="company" label="所属单位" initialValue="-1">
                <Select style={{ width: 200 }} showSearch filterOption={filterOption}>
                  {companyAll.map((item: Record<string, any>) => (
                    <Option key={item.id} value={item.id}>{item.companyName}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="date" label="查询日期">
                <RangePicker allowClear />
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={getData}>查询</Button>
                <Button onClick={initParams}>重置</Button>
              </Form.Item>
            </div>
          </div>

          <div className="flex mt10">
            <Form.Item name="logType" label="日志类型" initialValue="-1">
              <Select style={{ width: 200 }} showSearch filterOption={filterOption}>
                <Option value="-1">全部</Option>
                {LOG_LIST.map((item: Record<string, any>) => (
                  <Option key={item.key} value={item.key}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getLogList}
        columns={tableColumns}
        toolbar={toolbar}
        onDelete={serviceDeleteLog}
      />

      <DetailDrawer
        visible={state.showDetailDrawer}
        detail={state.detail}
        onClose={toggleDetailDrawer}
      />
    </div>
  )
}

export default LogPage
