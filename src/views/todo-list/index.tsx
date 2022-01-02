/**
 * 活动清单
 */
import React, { useEffect, useRef } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateTodoModal from './CreateTodoModal'
import { serviceGetTodoList, serviceDeleteTodoList, serviceUpdateTodoList } from '@/services'
import { STATUS } from './constants'
import { DatePicker, Button, Tag, Form, Popconfirm } from 'antd'
import { FORMAT_DATE, formatDateMinute, DATE_YEAR } from '@/utils'

const { RangePicker } = DatePicker

interface State {
  showCreateTodoModal: boolean
  currentRowData: Record<string, any> | null
}

const initState: State = {
  showCreateTodoModal: false,
  currentRowData: null
}

const TodoListPage = () => {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={STATUS[status].color}>
          {STATUS[status].text}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170
    },
    {
      title: '活动内容',
      dataIndex: 'content',
      className: 'wbba wpr'
    },
    {
      title: '操作',
      width: 250,
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
          <Button
            onClick={handleActionButton.bind(null, 2, row)}
            disabled={row.status === 2}
          >
            完成
          </Button>
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
      res.rows.map((item: any) => {
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

  function toggleCreateTodoModal() {
    setState({ showCreateTodoModal: !state.showCreateTodoModal })
  }

  const handleSuccess = function() {
    toggleCreateTodoModal()
    tableRef.current.getTableData()
  }

  function handleActionButton(buttonType: number, row: any) {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showCreateTodoModal: true, currentRowData: row })
        break
      // 删除
      case 1:
        serviceDeleteTodoList(row.id)
        .then(res => {
          tableRef.current.getTableData()
        })
        break
      // 状态
      case 2:
        serviceUpdateTodoList(row.id, { status: 2 })
        .then(res => {
          tableRef.current.getTableData()
        })
        break
      default:
    }
  }

  useEffect(() => {
    initParams()
  }, [])

  return (
    <div className="today-task">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
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
        onDelete={serviceDeleteTodoList}
        onAdd={() => setState({
          showCreateTodoModal: true,
          currentRowData: null
        })}
      />

      <CreateTodoModal
        visible={state.showCreateTodoModal}
        onSuccess={handleSuccess}
        onCancel={toggleCreateTodoModal}
        rowData={state.currentRowData}
      />
    </div>
  )
}

export default TodoListPage
