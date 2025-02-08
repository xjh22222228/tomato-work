/**
 * @author xiejiahe <xjh22222228@gmail.com>
 * @example:
 * <Table
 *   // 配置ref用于调用父组件方法获取数据
 *   ref={tableRef}
 *
 *   // getData 接口函数获取数据，必须返回一个axios Promise 同时处理好数据
 *   getTableData={getData}
 *
 *   columns={tableColumns}
 * />
 */

import React, { FC, useEffect, useImperativeHandle } from 'react'
import './style.scss'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import useKeepState from 'use-keep-state'
import Toolbar from './Toolbar'
import useDebounceFn from '@/hooks/useDebounceFn'

interface Props extends TableProps<any> {
  getTableData: (data: any) => Promise<any>
  onTableChange?: (pagination: any, filters: any, sorter: any) => void
  onDelete?: (id: string) => Promise<any>
  onAdd?: () => void
  onRowSelectionChange?: (selectedRowKeys: string[], rows: any[]) => void
  toolbar?: React.ReactNode
  [key: string]: any
}

interface State {
  tableHeight: number
  tableDataSource: any[]
  isLoading: boolean
  pagination: Record<string, any>
  selectedRowKeys: string[]
  columns: any[]
}

const DEFAULT_PAGE_SIZE = 50

const initialState: State = {
  tableHeight: 0,
  tableDataSource: [],
  isLoading: false,
  pagination: {
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    total: 0,
    pageSizeOptions: ['30', '50', '70', '100', '200', '1000'],
  },
  selectedRowKeys: [],
  columns: [],
}

function showTotal(total: number) {
  return `共有 ${total} 条`
}

const TableFC: FC<Props> = ({
  getTableData,
  onTableChange,
  onDelete,
  onAdd,
  onRowSelectionChange,
  ref: tableRef,
  columns,
  toolbar,
  ...props
}) => {
  let rowSelection
  const showRowSelection = onDelete
  const [state, setState] = useKeepState(initialState)

  const { run: getData } = useDebounceFn(
    () => {
      setState({ isLoading: true })
      const { pageNo, pageSize } = tableRef.current
      // 调用父组件函数获取数据
      getTableData({
        pageNo: pageNo - 1,
        pageSize: pageSize,
      })
        .then((res) => {
          setState({
            pagination: {
              ...state.pagination,
              total: res.count,
              pageSize,
            },
            tableDataSource: res.rows,
          })
        })
        .finally(() => {
          setState({ isLoading: false })
        })
    },
    { wait: 500, leading: true }
  )

  function onChange(pagination: any, filters: any, sorter: any) {
    const pageNo = pagination.current
    const pageSize = pagination.pageSize
    setState({
      pagination: {
        ...state.pagination,
        pageNo,
        pageSize,
      },
    })
    tableRef.current.pageNo = pageNo
    tableRef.current.pageSize = pageSize
    onTableChange?.(pagination, filters, sorter)
    getData()
  }

  function reset() {
    setState({ selectedRowKeys: [] })
    onRowSelectionChange?.([], [])
  }

  useImperativeHandle(tableRef, () => ({
    getTableData: getData,
    reset,
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  }))

  useEffect(() => {
    // 设置表格的高度
    setTimeout(() => {
      const tableEl = document.querySelector('.ant-table-wrapper')
      if (tableEl) {
        setState({ tableHeight: tableEl.clientHeight - 120 })
      }
    }, 100)
  }, [])

  useEffect(() => {
    if (Array.isArray(columns)) {
      setState({
        columns: [
          {
            title: '序号',
            width: 60,
            render: (_: any, $: any, i: number) => i + 1,
            align: 'center',
          },
        ].concat(columns as []),
      })
    }
  }, [columns])

  function handleDelete() {
    if (!onDelete) return null
    const selectedRowKeys = state.selectedRowKeys.join(',')
    onDelete(selectedRowKeys).then(() => {
      setState({ selectedRowKeys: [] })
      getData()
    })
  }

  if (showRowSelection) {
    rowSelection = {
      selectedRowKeys: state.selectedRowKeys,
      onChange(selectedRowKeys: string[]) {
        setState({ selectedRowKeys })
        onRowSelectionChange?.(selectedRowKeys, state.tableDataSource)
      },
    }
  }

  return (
    <React.Fragment>
      <Toolbar
        selectedRowKeys={state.selectedRowKeys}
        toolbar={toolbar}
        onDelete={onDelete && handleDelete}
        onAdd={onAdd}
      />

      <Table
        {...(props as any)}
        rowKey="id"
        loading={state.isLoading}
        columns={state.columns}
        dataSource={state.tableDataSource}
        scroll={{ y: state.tableHeight + 'px', x: 1200 }}
        showHeader={state.tableDataSource.length}
        onChange={onChange}
        rowSelection={rowSelection}
        pagination={{
          ...state.pagination,
          size: 'small',
          showTotal,
        }}
      />
    </React.Fragment>
  )
}

export default React.memo(TableFC)
