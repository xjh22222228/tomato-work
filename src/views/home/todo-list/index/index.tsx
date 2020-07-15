import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import useKeepState from 'use-keep-state';
import Table from '@/components/table';
import CreateTodo from '../components/create-todo';
import { serviceGetTodoList, serviceDeleteTodoList, serviceUpdateTodoList } from '@/services';
import { STATUS } from '../constants';
import { DatePicker, Button, Tag } from 'antd';
import {
  getThisYearFirstDay,
  getCurMonthLastDay,
  modalConfirmDelete,
  ONE_DAY_TIMESTAMP
} from '@/utils';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface State {
  date: moment.Moment[];
  showCreateTodoModal: boolean;
  currentRowData: { [key: string]: any; } | null;
}

const initialState: State = {
  date: [],
  showCreateTodoModal: false,
  currentRowData: null
};

const TodoList = () => {
  const [state, setState] = useKeepState(initialState);
  const tableRef = useRef<any>();
  const [tableColumns] = useState([
    { title: '状态', dataIndex: 'status', width: 90, render: (status: number) => (
      <Tag color={STATUS[status].color}>{STATUS[status].text}</Tag>
    )},
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    { title: '活动内容', dataIndex: 'content', className: 'word-break_break-all' },
    { title: '操作', width: 250, align: 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 0, row)}>编辑</Button>
          <Button onClick={handleActionButton.bind(null, 1, row)}>删除</Button>
          <Button
            onClick={handleActionButton.bind(null, 2, row)}
            disabled={row.status === 2}
          >
            完成
          </Button>
        </>
      )
    }
  ]);

  function getData() {
    tableRef.current.getTableData();
  }

  const getTodoList = useCallback((params?: any) => {
    params.startDate = state.date[0].valueOf();
    params.endDate = state.date[1].valueOf() + ONE_DAY_TIMESTAMP;

    return serviceGetTodoList(params).then(res => {
      res.data.data.rows.map((item: any) => {
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
        return item;
      });
      return res;
    })
  }, [state.date]);

  const initParams = useCallback(() => {
    const startDate = moment(getThisYearFirstDay(), dateFormat);
    const endDate = moment(getCurMonthLastDay(dateFormat), dateFormat);
    setState({ date: [startDate, endDate] });
  }, [setState]);

  const handleOnSuccess = useCallback(() => {
    setState({ showCreateTodoModal: false });
    tableRef.current.getTableData();
  }, [setState]);

  const handleActionButton = useCallback((buttonType: number, row: any) => {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showCreateTodoModal: true, currentRowData: row });
        break;
      // 删除
      case 1:
        modalConfirmDelete()
        .then(() => {
          serviceDeleteTodoList(row.id)
          .then(res => {
            if (res.data.success) {
              tableRef.current.getTableData();
            }
          });
        });
        break;
      // 状态
      case 2:
        serviceUpdateTodoList(row.id, { status: 2 })
        .then(res => {
          if (res.data.success) {
            tableRef.current.getTableData();
          }
        });
        break;
      default:
    }
  }, [setState]);

  useEffect(() => {
    initParams();
  }, [initParams]);

  useEffect(() => {
    if (state.date.length <= 0) return;
    tableRef?.current?.getTableData();
  }, [state.date]);

  return (
    <div className="today-task">
      <div className="query-panel">
        <span>查询日期：</span>
        <RangePicker
          format={dateFormat}
          allowClear
          value={state.date}
          onChange={(date: any) => setState({ date })}
        />
        <Button type="primary" onClick={getData}>查询</Button>
        <Button onClick={() => setState({
          showCreateTodoModal: true,
          currentRowData: null
        })}>新增</Button>
        <Button onClick={initParams}>重置</Button>
      </div>
      <Table
        ref={tableRef}
        getTableData={getTodoList}
        columns={tableColumns}
      />
      <CreateTodo
        visible={state.showCreateTodoModal}
        onSuccess={handleOnSuccess}
        setParentState={setState}
        rowData={state.currentRowData}
      />
    </div>
  );
};

export default TodoList;
