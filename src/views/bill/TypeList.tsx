import React, { useEffect } from 'react'
import './style.scss'
import dayjs from 'dayjs'
import { useSetState } from 'ahooks'
import CreateTypeModal from './CreateTypeModal'
import { Table, Button, Tag, Popconfirm } from 'antd'
import { serviceGetBillType, serviceDeleteBillType } from '@/services'
import { TypeNames, TypeColors } from './enum'
import { FORMAT_DATE_MINUTE } from '@/utils'

const initialState = {
  showCreateTypeModal: false,
  selectedRowKeys: [],
  loading: false,
  data: [],
  rowData: null,
}

const Type = () => {
  const [state, setState] = useSetState(initialState)
  const tableColumns = [
    {
      title: '账务类型',
      dataIndex: 'name',
    },
    {
      title: '收支类别',
      render: (rowData: any) => (
        <Tag color={rowData.color}>{rowData.typeName}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      render: (rowData: any) => (
        <Button onClick={handleEdit.bind(null, rowData)}>编辑</Button>
      ),
    },
  ]

  function getBillType() {
    setState({ loading: true })
    serviceGetBillType()
      .then((res) => {
        const handleData = res.map((item: any) => {
          item.typeName = TypeNames[item.type]
          item.color = TypeColors[item.type]
          item.createdAt = dayjs(item.createdAt).format(FORMAT_DATE_MINUTE)
          return item
        })
        setState({ data: handleData })
      })
      .finally(() => {
        setState({ loading: false })
      })
  }

  function deleteBillType() {
    const ids = state.selectedRowKeys
    if (!ids.length) return

    setState({ loading: true })
    serviceDeleteBillType(ids)
      .then(() => {
        getBillType()
      })
      .finally(() => {
        setState({ loading: false })
      })
  }

  function handleOnSuccess() {
    setState({ showCreateTypeModal: false })
    getBillType()
  }

  function handleAdd() {
    setState({
      showCreateTypeModal: true,
      rowData: null,
    })
  }

  function handleEdit(rowData: any) {
    setState({
      showCreateTypeModal: true,
      rowData,
    })
  }

  useEffect(() => {
    getBillType()
  }, [])

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setState({ selectedRowKeys })
    },
  }

  return (
    <div className="capital-flow-type">
      <div className="button-group">
        <Popconfirm
          title="您确定要删除吗？"
          onConfirm={deleteBillType}
          placement="bottomRight"
          okType="danger"
        >
          <Button type="primary" danger>
            删除
          </Button>
        </Popconfirm>
        <Button type="primary" onClick={handleAdd}>
          新增
        </Button>
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
