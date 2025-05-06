/**
 * 日志管理
 */
import React, { useEffect, useRef, useMemo } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import DetailDrawer from './DetailDrawer'
import { serviceDeleteLog, serviceGetLogList } from '@/services/log'
import { DatePicker, Button, Select, Form, Popconfirm, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { FORMAT_DATE, filterOption, isMobile } from '@/utils'
import { DownOutlined } from '@ant-design/icons'
import { LOG_LIST } from './constants'
import { useNavigate, Link } from 'react-router-dom'
import { getAllCompany } from '@/store/companySlice'
import { useAppDispatch, useAppSelector } from '@/hooks'

const notMobile = !isMobile()
const { RangePicker } = DatePicker

interface State {
  companyAll: Record<string, any>[]
  showDetailDrawer: boolean
  detail: Record<string, any>
}

const initState: State = {
  companyAll: [],
  showDetailDrawer: false,
  detail: {},
}

const LogPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>(null)
  const dispatch = useAppDispatch()
  const companyAll = useAppSelector((state) => state.company.companyAll)

  const memoizedCompanyAll = useMemo(() => {
    return [
      {
        label: '全部',
        value: 0,
      },
      ...companyAll.map((item) => ({
        label: item.companyName,
        value: item.id,
      })),
    ]
  }, [companyAll])

  const tableColumns: any[] = [
    {
      title: '创建时间',
      dataIndex: '__createdAt__',
      width: 170,
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
      fixed: notMobile && 'right',
      render: (row: Record<string, any>) => (
        <>
          <Button onClick={() => handlePreview(row)}>详情</Button>

          <Link to={`/home/log/detail/${row.id}`}>
            <Button className="!ml-2.5">编辑</Button>
          </Link>

          <Popconfirm
            title="您确定要删除吗？"
            placement="bottomRight"
            okType="danger"
            onConfirm={() => handleDelLog(row.id)}
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      ),
    },
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
    params.companyId = values.company || undefined
    params.logType = values.logType || undefined

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

  function handleClickMenu(key: number) {
    navigate(`/home/log/create/${key}`)
  }

  const items: MenuProps['items'] = useMemo(() => {
    return LOG_LIST.map((item) => ({
      key: item.key,
      label: <div onClick={() => handleClickMenu(item.key)}>{item.name}</div>,
    }))
  }, [LOG_LIST])

  const logOptions = useMemo(() => {
    return [
      {
        label: '全部',
        value: 0,
      },
      ...LOG_LIST.map((item) => ({
        label: item.name,
        value: item.key,
      })),
    ]
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
          <div className="!w-full">
            <div className="flex">
              <Form.Item name="company" label="所属单位" initialValue={0}>
                <Select
                  style={{ width: 200 }}
                  filterOption={filterOption}
                  options={memoizedCompanyAll}
                ></Select>
              </Form.Item>

              <Form.Item name="date" label="查询日期">
                <RangePicker allowClear />
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={getData}>
                  查询
                </Button>
                <Button onClick={initParams}>重置</Button>
              </Form.Item>
            </div>
          </div>

          <div className="flex !mt-2.5">
            <Form.Item name="logType" label="日志类型" initialValue={0}>
              <Select
                style={{ width: 200 }}
                filterOption={filterOption}
                options={logOptions}
              ></Select>
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
