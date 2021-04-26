import React, { useEffect } from 'react'
import './style.scss'
import moment from 'moment'
import useKeepState from 'use-keep-state'
import CreateTypeModal from './CreateTypeModal'
import { Table, Button, Tag, Popconfirm } from 'antd'
import {
  serviceGetCapitalFlowType,
  serviceDeleteCapitalFlowType
} from '@/services'
import { TypeNames, TypeColors } from './enum'

const initialState = {
  showCreateTypeModal: false,
  selectedRowKeys: [],
  loading: false,
  data: [],
  rowData: null
}

const Type = () => {
  const [state, setState] = useKeepState(initialState)
  const tableColumns = [
    {
      title: '账务类型',
      dataIndex: 'name'
    },
    {
      title: '收支类别',
      render: (rowData: any) => (
        <Tag color={rowData.color}>{rowData.typeName}</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
    },
    {
      title: '操作',
      render: (rowData: any) => (
        <Button onClick={handleEdit.bind(null, rowData)}>编辑</Button>
      )
    },
  ]

  function getCapitalFlowType() {
    serviceGetCapitalFlowType()
      .then(res => {
        if (res.data.success) {
          const handleData = res.data.data.map((item: any) => {
            item.typeName = TypeNames[item.type]
            item.color = TypeColors[item.type]
            item.createdAt = moment(item.createdAt).format('YYYY-MM-DD hh:mm')
            return item
          })
          setState({ data: handleData })
        }
      })
  }

  function deleteCapitalFlowType() {
    const ids = state.selectedRowKeys.join()
    if (!ids) return

    setState({ loading: true })
    serviceDeleteCapitalFlowType(ids)
      .then(() => {
        getCapitalFlowType()
      })
      .finally(() => {
        setState({ loading: false })
      })
  }

  function handleOnSuccess() {
    setState({ showCreateTypeModal: false })
    getCapitalFlowType()
  }

  function handleAdd() {
    setState({
      showCreateTypeModal: true,
      rowData: null
    })
  }

  function handleEdit(rowData: any) {
    setState({
      showCreateTypeModal: true,
      rowData
    })
  }

  useEffect(() => {
    getCapitalFlowType()
  }, [])

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setState({ selectedRowKeys })
    }
  }

  return (
    <div className="capital-flow-type">
      <div className="button-group">
        <Popconfirm
          title="您确定要删除吗？"
          onConfirm={deleteCapitalFlowType}
          placement="bottomLeft"
          okType="danger"
        >
          <Button type="primary" danger>删除</Button>
        </Popconfirm>
        <Button type="primary" onClick={handleAdd}>新增</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={state.data}
        pagination={false}
        rowKey="id"
        loading={state.loading}
      />

      <CreateTypeModal
        visible={state.showCreateTypeModal}
        rowData={state.rowData}
        onCancel={() => setState({ showCreateTypeModal: false })}
        onSuccess={handleOnSuccess}
      />
    </div>
  )
}

export default Type
