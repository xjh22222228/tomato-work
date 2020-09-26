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

import React, { FC, useEffect } from 'react';
import './style.scss';
import { Table } from 'antd';
import { TableProps } from 'rc-table/lib/Table';
import { AxiosPromise } from 'axios';
import useKeepState from 'use-keep-state';
import ActionPanel from './action-panel';

interface Props extends TableProps {
  getTableData: (data: any) => AxiosPromise;
  onTableChange?: (pagination: any, filters: any, sorter: any) => void;
  onDelete?: (id: string) => AxiosPromise;
  onAdd?: () => void;
  [key: string]: any;
}

interface State {
  tableHeight: number;
  tableDataSource: any[];
  isLoading: boolean;
  pagination: {
    [key: string]: any;
  },
  selectedRowKeys: string[];
  columns: any[]
}

const DEFAULT_PAGE_SIZE = 50;

const initialState: State = {
  tableHeight: 0,
  tableDataSource: [],
  isLoading: false,
  pagination: {
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    total: 0,
    pageSizeOptions: ['30', '50', '70', '100', '200']
  },
  selectedRowKeys: [],
  columns: []
};

function showTotal(total: number) {
  return `共有 ${total} 条`;
}

const TableFC: FC<Props> = ({
  getTableData,
  onTableChange,
  onDelete,
  onAdd,
  forwardedRef: tableRef,
  columns,
  ...props
}) => {
  let rowSelection;
  const showRowSelection = onDelete;
  const [state, setState] = useKeepState(initialState);

  function getData() {
    setState({ isLoading: true });
    const { pageNo, pageSize } = tableRef.current;
    // 调用父组件函数获取数据
    getTableData({
      pageNo: pageNo - 1,
      pageSize: pageSize
    })
      .then(res => {
        if (res.data.success) {
          setState({
            pagination: {
              ...state.pagination,
              total: res.data.data.count,
              pageSize
            },
            tableDataSource: res.data.data.rows
          });
        }
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  }

  function onChange(pagination: any, filters: any, sorter: any) {
    const pageNo = pagination.current;
    const pageSize = pagination.pageSize;
    setState({
      pagination: {
        ...state.pagination,
        pageNo,
        pageSize
      }
    });
    tableRef.current.pageNo = pageNo;
    tableRef.current.pageSize = pageSize;
    getData();
    onTableChange && onTableChange(pagination, filters, sorter);
  }

  useEffect(() => {
    if (!tableRef.current) {
      tableRef.current = {};
    }
    // 新增方法给父组件调用
    tableRef.current.getTableData = getData;
  });

  useEffect(() => {
    tableRef.current.pageNo = 1;
    tableRef.current.pageSize = DEFAULT_PAGE_SIZE;
  }, [tableRef]);

  useEffect(() => {
    // 设置表格的高度
    setTimeout(() => {
      const tableEl = document.querySelector('.ant-table-wrapper');
      if (tableEl) {
        setState({ tableHeight: tableEl.clientHeight - 120 });
      }
    }, 0);
  }, [setState]);

  useEffect(() => {
    if (Array.isArray(columns)) {
      setState({
        columns: [
          {
            title: '序号',
            width: 60,
            render: (_: any, $: any, i: number) => i + 1,
            align: 'center'
          }
        ].concat(columns as [])
      });
    }
  }, [columns]);

  function handleDelete() {
    if (!onDelete) return null;
    const selectedRowKeys = state.selectedRowKeys.join(',');
    onDelete(selectedRowKeys)
      .then(res => {
        if (res.data.success) {
          setState({ selectedRowKeys: [] });
          getData();
        }
      });
  }

  if (showRowSelection) {
    rowSelection = {
      onChange(selectedRowKeys: string[]) {
        setState({ selectedRowKeys });
      }
    };
  }

  return (
    <React.Fragment>
      <ActionPanel
        selectedRowKeys={state.selectedRowKeys}
        onDelete={onDelete && handleDelete}
        onAdd={onAdd}
      />

      <Table
        {...props as any}
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
          showTotal
        }}
      />
    </React.Fragment>
  );
};

const forwardedTable = React.forwardRef((props: any, ref) => (
  <TableFC {...props} forwardedRef={ref} />
));

export default React.memo(forwardedTable);
