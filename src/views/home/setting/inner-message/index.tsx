/**
 * 消息中心
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './style.scss';
import moment from 'moment';
import Table from '@/components/table';
import { Button } from 'antd';
import { serviceGetInnerMessage, serviceUpdateInnerMessageHasRead } from '@/services';

const InnerMessage = () => {
  const tableRef = useRef<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableColumns] = useState([
    { title: '', dataIndex: 'hasRead', width: 12, className: 'unread-row',
      render: (hasRead: boolean) => (
        !hasRead && <i className="unread-dot">●</i>
      )},
    { title: '标题内容', dataIndex: 'content' },
    { title: '提交时间', dataIndex: 'createdAt', width: 150 },
    { title: '类型', dataIndex: 'title', width: 130 }
  ]);

  const getInnerMessage = useCallback((params?: object) => {
    return serviceGetInnerMessage(params)
    .then(res => {
      if (res.data.success) {
        res.data.data.rows.forEach((item: any) => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
        });
      }
      return res;
    });
  }, []);

  const handleAction = useCallback((buttonType: 1 | 2) => {

    let params = selectedRowKeys.join();
    if (buttonType === 2) {
      params = 'all';
    }

    serviceUpdateInnerMessageHasRead(params)
    .then(res => {
      if (res.data.success) {
        setSelectedRowKeys([]);
        tableRef.current.getTableData();
      }
    });
  }, [selectedRowKeys, tableRef, setSelectedRowKeys]);

  useEffect(() => {
    tableRef.current.getTableData();
  }, [tableRef]);

  return (
    <div className="inner-message">
      <Table
        ref={tableRef}
        getTableData={getInnerMessage}
        columns={tableColumns}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys: any) => setSelectedRowKeys(selectedKeys)
        }}
      />
      <div className="action-group">
        <Button
          onClick={handleAction.bind(null, 1)}
          disabled={selectedRowKeys.length <= 0}
        >
          标记已读
        </Button>
        <Button onClick={handleAction.bind(null, 2)}>全部已读</Button>
      </div>
    </div>
  );
};

export default InnerMessage;
