import React, { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Button, Tag } from 'antd';
import { getThisYearFirstDay, getCurMonthLastDay, modalConfirmDelete } from '@/utils';
import moment from 'moment';
import Table from '@/components/Table';
import CreateTodo from '../components/CreateTodo';
import { serviceGetTodoList, serviceDeleteTodoList, serviceUpdateTodoList } from '@/services';
import { STATUS } from '../constants';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface State {
  date: moment.Moment[];
  showCreateTodoModal: boolean;
  currentRowData: { [propName: string]: any; } | null;
}

const initialState: State = {
  date: [],
  showCreateTodoModal: false,
  currentRowData: null
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const TodoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const tableRef = useRef<any>(null);
  const [tableColumns] = useState([
    { title: '状态', dataIndex: 'status', width: 90, render: (status: number) => (
      <Tag color={STATUS[status].color}>{ STATUS[status].text }</Tag>
    )},
    { title: '创建时间', dataIndex: 'createdAt', width: 170 },
    { title: '活动内容', dataIndex: 'content', className: 'word-break_break-all' },
    { title: '操作', width: 250,
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

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state });
  }, []);

  const getData = useCallback(() => {
    tableRef.current.getTableData();
  }, []);

  const getTodoList = useCallback((params?: any) => {
    params.startDate = state.date[0].valueOf();
    params.endDate = state.date[1].valueOf();
    
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
    setTimeout(() => {
      tableRef.current.getTableData();
    }, 100);
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
