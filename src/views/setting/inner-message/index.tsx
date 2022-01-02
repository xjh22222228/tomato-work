/**
 * 消息中心
 */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import './style.scss'
import Table from '@/components/table'
import { Button } from 'antd'
import { serviceGetInnerMessage, serviceUpdateInnerMessageHasRead } from '@/services'
import { formatDateMinute } from '@/utils'

const InnerMessagePage = () => {
  const tableRef = useRef<any>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const tableColumns = [
    { title: '', dataIndex: 'hasRead', width: 12, className: 'unread-row',
      render: (hasRead: boolean) => (
        !hasRead && <i className="unread-dot">●</i>
      )},
    { title: '标题内容', dataIndex: 'content' },
    { title: '提交时间', dataIndex: 'createdAt', width: 150 },
    { title: '类型', dataIndex: 'title', width: 130 }
  ]

  const getInnerMessage = useCallback((params?: object) => {
    return serviceGetInnerMessage(params)
            .then(res => {
              res.rows.forEach((item: any) => {
                item.createdAt = formatDateMinute(item.createdAt)
              })
              return res
            })
  }, [])

  function markHaveRead(params?: unknown) {
    params ||= selectedRowKeys.join()

    serviceUpdateInnerMessageHasRead(params)
      .then(() => {
        setSelectedRowKeys([])
        tableRef.current.getTableData()
      })
  }

  function markAllHaveRead() {
    markHaveRead('all')
  }

  useEffect(() => {
    tableRef.current.getTableData()
  }, [tableRef])

  return (
    <div className="inner-message">
      <Table
        ref={tableRef}
        getTableData={getInnerMessage}
        columns={tableColumns}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys: string[]) => setSelectedRowKeys(selectedKeys)
        }}
      />
      <div className="action-group">
        <Button
          onClick={markHaveRead}
          disabled={selectedRowKeys.length <= 0}
        >
          标记已读
        </Button>
        <Button onClick={markAllHaveRead}>全部已读</Button>
      </div>
    </div>
  )
}

export default InnerMessagePage
