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
import { Table } from 'antd';
import { TableProps } from 'rc-table/lib/Table';
import { AxiosPromise } from 'axios';
import useKeepState from 'use-keep-state';

interface Props {
  getTableData: (data: any) => AxiosPromise;
  onTableChange?: (a: any, b: any, c: any) => void;
  [propsName: string]: any;
}

interface State {
  tableHeight: number;
  tableDataSource: any[];
  isLoading: boolean;
  pagination: {
    [propName: string]: any;
  }
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
  }
};

const TableFC: FC<Props & TableProps<unknown>> = ({
  getTableData,
  onTableChange,
  forwardedRef: tableRef,
  ...props
}) => {
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

  const onChange = function(pagination: any, filters: any, sorter: any) {
    setState({
      pagination: {
        ...state.pagination,
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize
      }
    });
    tableRef.current.pageNo = pagination.pageNo;
    tableRef.current.pageSize = pagination.pageSize;
    getData();
    onTableChange && onTableChange(pagination, filters, sorter);
  };

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

  return (
    <Table
      {...props as any}
      rowKey="id"
      loading={state.isLoading}
      dataSource={state.tableDataSource}
      scroll={{ y: state.tableHeight + 'px' }}
      showHeader={state.tableDataSource.length}
      onChange={onChange}
      pagination={{
        ...state.pagination,
        size: 'small'
      }}
    />
  )
};

const forwardedTable = React.forwardRef((props: any, ref) => (
  <TableFC {...props} forwardedRef={ref} />
));

export default React.memo(forwardedTable);
