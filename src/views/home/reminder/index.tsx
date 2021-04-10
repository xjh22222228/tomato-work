/**
 * 提醒事项
 */
import React, { useEffect, useRef } from 'react'
import Table from '@/components/table'
import moment from 'moment'
import CreateReminder from './components/create-reminder'
import useKeepState from 'use-keep-state'
import { connect } from 'react-redux'
import { DatePicker, Button, Select, Tag, Modal, Form, Popconfirm } from 'antd'
import { serviceGetReminder, serviceDeleteReminder } from '@/services'

const { RangePicker } = DatePicker
const Option = Select.Option
const DATE_FORMAT = 'YYYY-MM-DD'
const STATUS_TYPE: any = {
  1: { color: '#f50', text: '待提醒' },
  2: { color: '#87d068', text: '已提醒' }
}

interface State {
  showCreateModal: boolean
  currentRow: { [propName: string]: any } | null
}

type Props = ReturnType<typeof mapStateToProps>

const initialState: State = {
  showCreateModal: false,
  currentRow: null
}

const ReminderPage: React.FC<Props> = function({ userInfo }) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: '状态',
      dataIndex: 'type',
      width: 100,
      render: (row: any) => (
        <Tag color={STATUS_TYPE[row].color}>
          {STATUS_TYPE[row].text}
        </Tag>
      )
    },
    {
      title: '提醒时间',
      dataIndex: 'createdAt',
      width: 220
    },
    {
      title: '提醒内容',
      dataIndex: 'content',
      className: 'wbba wpr'
    },
    {
      title: '操作',
      width: 180,
      align: 'right',
      fixed: 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleButton.bind(null, 0, row)}>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={handleButton.bind(null, 1, row)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  const initParams = function() {
    const startDate = moment().startOf('year')
    const endDate = moment().endOf('year')
    form.setFieldsValue({
      queryType: '',
      date: [startDate, endDate]
    })
    tableRef?.current?.getTableData()
  }

  function getReminder(params: any = {}) {
    const values = form.getFieldsValue()

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(DATE_FORMAT)
      params.endDate = values.date[1].format(DATE_FORMAT)
    }

    if (values.queryType !== '') {
      params.type = values.queryType
    }

    return serviceGetReminder(params).then(res => {
      if (res.data.success) {
        res.data.data.rows = res.data.data.rows.map((el: any, idx: number) => {
          el.order = idx + 1
          el.createdAt = moment(el.createdAt).format('YYYY-MM-DD HH:mm:ss')
          return el
        })
      }
      return res
    })
  }

  function handleButton(type: number, rows: any) {
    // 编辑
    if (type === 0) {
      setState({
        showCreateModal: true,
        currentRow: rows
      })
    } else {
      serviceDeleteReminder(rows.id)
      .then(res => {
        if (res.data.success) {
          tableRef.current.getTableData()
        }
      })
    }
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

  return (
    <div className="reminder">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item
            name="queryType"
            label="查询类型"
            initialValue=""
          >
            <Select>
              <Option value="">全部</Option>
              <Option value="1">待提醒</Option>
              <Option value="2">已提醒</Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="日期">
            <RangePicker allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={() => tableRef.current.getTableData()}>查询</Button>
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
  userInfo: store.user.userInfo
})

export default connect(mapStateToProps)(ReminderPage)
