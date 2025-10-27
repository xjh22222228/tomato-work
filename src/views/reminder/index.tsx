/**
 * 提醒事项
 */
import React, { useEffect, useRef } from 'react'
import Table from '@/components/table'
import dayjs from 'dayjs'
import CreateReminder from './CreateReminder'
import { connect } from 'react-redux'
import {
  DatePicker,
  Button,
  Select,
  Tag,
  Modal,
  Form,
  Popconfirm,
  Switch,
  type SelectProps,
} from 'antd'
import {
  serviceGetReminder,
  serviceDeleteReminder,
  serviceUpdateReminder,
} from '@/services'
import { FORMAT_DATE, formatDateTime, isMobile } from '@/utils'
import { useSetState, useRequest } from 'ahooks'

const noMobile = !isMobile()

const { RangePicker } = DatePicker
const STATUS_TYPE = {
  1: { color: '#f50', text: '待提醒' },
  2: { color: '#87d068', text: '已提醒' },
} satisfies Record<string, any>

interface State {
  showCreateModal: boolean
  currentRow: Record<string, any> | null
}

type Props = ReturnType<typeof mapStateToProps>

const initialState: State = {
  showCreateModal: false,
  currentRow: null,
}

const ReminderPage: React.FC<Props> = function ({ userInfo }) {
  const [form] = Form.useForm()
  const [state, setState] = useSetState(initialState)
  const tableRef = useRef<any>(null)
  const { loading, runAsync } = useRequest(serviceUpdateReminder, {
    manual: true,
  })
  const tableColumns: any[] = [
    {
      title: '状态',
      dataIndex: 'type',
      width: 100,
      render: (row: keyof typeof STATUS_TYPE) => (
        <Tag color={STATUS_TYPE[row].color}>{STATUS_TYPE[row].text}</Tag>
      ),
    },
    {
      title: '提醒时间',
      dataIndex: 'date',
      width: 220,
    },
    {
      title: '提醒内容',
      dataIndex: 'content',
      className: 'break-all whitespace-pre',
    },
    {
      title: '操作',
      width: 240,
      align: 'right',
      fixed: noMobile && 'right',
      render: (record: any) => (
        <>
          <Switch
            loading={loading}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.open}
            onChange={() => handleSwitch(record)}
          />
          <Button onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={() => handleDelete(record)}
            placement="bottomRight"
            okType="danger"
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const initParams = function () {
    const startDate = dayjs().startOf('year')
    const endDate = dayjs().endOf('year')
    form.setFieldsValue({
      queryType: 0,
      date: [startDate, endDate],
    })
    tableRef?.current?.getTableData()
  }

  function getReminder(params: any = {}) {
    const values = form.getFieldsValue()

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }

    if (values.queryType !== 0) {
      params.type = values.queryType
    }

    return serviceGetReminder(params).then((res) => {
      res.rows = res.rows.map((el: any, idx: number) => {
        el.order = idx + 1
        el.createdAt = formatDateTime(el.createdAt)
        return el
      })
      return res
    })
  }

  function handleSwitch(record: any) {
    runAsync(record.id, {
      open: !record.open,
    }).then(() => {
      tableRef.current.getTableData()
    })
  }

  function handleEdit(record: any) {
    setState({
      showCreateModal: true,
      currentRow: record,
    })
  }

  function handleDelete(record: any) {
    serviceDeleteReminder(record.id).then(() => {
      tableRef.current.getTableData()
    })
  }

  // modal成功新增回调函数
  function handleCloseModal() {
    setState({ showCreateModal: false })
    tableRef.current.getTableData()
  }

  useEffect(() => {
    initParams()

    if (!userInfo.email) {
      Modal.warning({
        title: '未检测到您的邮箱',
        content: (
          <>
            请将您的GitHub邮箱设为公开，否则影响本功能的使用，
            <a
              href="https://github.com/settings/profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              前往设置
            </a>
          </>
        ),
      })
    }
  }, [userInfo.email])

  const options: SelectProps['options'] = [
    { label: '全部', value: 0 },
    { label: '待提醒', value: 1 },
    { label: '已提醒', value: 2 },
  ]

  return (
    <div className="reminder">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item name="queryType" label="查询类型" initialValue={0}>
            <Select options={options}></Select>
          </Form.Item>

          <Form.Item name="date" label="日期">
            <RangePicker allowClear />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={() => tableRef.current.getTableData()}
            >
              查询
            </Button>
            <Button onClick={initParams}>重置</Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getReminder}
        columns={tableColumns}
        onDelete={serviceDeleteReminder}
        onAdd={() => setState({ showCreateModal: true, currentRow: null })}
      />

      <CreateReminder
        visible={state.showCreateModal}
        rowData={state.currentRow}
        onCancel={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </div>
  )
}

const mapStateToProps = (store: any) => ({
  userInfo: store.user.userInfo,
})

export default connect(mapStateToProps)(ReminderPage)
