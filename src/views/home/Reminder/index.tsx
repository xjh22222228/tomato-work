import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { DatePicker, Button, Select, Tag } from 'antd';
import moment from 'moment';
import { getCurMonthFirstDay, getCurMonthLastDay, modalConfirmDelete } from '@/utils';
import CreateReminder from './components/CreateReminder';
import { serviceGetReminder, serviceDeleteReminder } from '@/services';
import Table from '@/components/Table';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const STATUS_TYPE: any = {
  1: { color: '#f50', text: '待提醒' },
  2: { color: '#87d068', text: '已提醒' }
};

interface State {
  date: moment.Moment[];
  queryType: string;
  modalVisible: boolean;
  currentRow: { [propName: string]: any } | null
}

const initialState: State = {
  date: [],
  queryType: '',
  modalVisible: false,
  currentRow: {}
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const Reminder: React.FC = function() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const tableRef = useRef<any>(null);
  const [tableColumns] = useState([
    { title: '序号', dataIndex: 'order', width: 70 },
    { title: '提醒时间', dataIndex: 'date', width: 220 },
    { title: '提醒内容', dataIndex: 'content', className: 'word-break_break-all white-space_pre' },
    { title: '状态', dataIndex: 'type', width: 100,
      render: (row: any) => (
        <Tag color={STATUS_TYPE[row].color}>{ STATUS_TYPE[row].text }</Tag>
      )
    },
    { title: '操作', dataIndex: '', width: 180,
      render: (row: any) => (
        <>
          <Button onClick={handleButton.bind(null, 0, row)}>编辑</Button>
          <Button onClick={handleButton.bind(null, 1, row)}>删除</Button>
        </>
      )
    }
  ]);

  const setState = useCallback(state => {
    dispatch({ type: 'setState', state })
  }, []);

  // 初始化参数
  const initParams = useCallback(() => {
    const startDate = moment(getCurMonthFirstDay(dateFormat), dateFormat);
    const endDate = moment(getCurMonthLastDay(dateFormat), dateFormat);
    setState({ queryType: '', date: [startDate, endDate] });
    setTimeout(() => {
      tableRef.current.getTableData();
    }, 100);
  }, [setState]);

  // 获取事项数据
  const getReminder = useCallback((params: any = {}) => {

    if (state.queryType !== '') {
      params.type = state.queryType;
    }
    if (state.date.length === 2) {
      params.startDate = state.date[0].valueOf();
      params.endDate = state.date[1].valueOf();
    }

    return serviceGetReminder(params).then(res => {
      if (res.data.success) {
        res.data.data.rows = res.data.data.rows.map((el: any, idx: number) => {
          el.order = idx + 1;
          el.date = moment(el.date).format('YYYY-MM-DD HH:mm:ss');
          return el;
        });
      }
      return res;
    });
  }, [state.date, state.queryType]);

  const handleButton = useCallback((type: number, rows: any) => {
    // 编辑
    if (type === 0) {
      setState({ modalVisible: true, currentRow: rows });
    } else {
      modalConfirmDelete()
      .then(() => {
        serviceDeleteReminder(rows.id)
        .then(res => {
          if (res.data.success) {
            tableRef.current.getTableData();
          }
        });
      });
    }
  }, [setState]);

  // modal成功新增回调函数
  const handleModalOnSuccess = useCallback(() => {
    setState({ modalVisible: false });
    tableRef.current.getTableData();
  }, [setState]);

  useEffect(() => {
    initParams();
  }, [initParams]);

  return (
    <div className="reminder">
      <div className="query-panel">
        <span>查询类型：</span>
        <Select 
          onChange={(value: string) => setState({ queryType: value })} 
          value={state.queryType}
        >
          <Option value="">全部</Option>
          <Option value="1">待提醒</Option>
          <Option value="2">已提醒</Option>
        </Select>
        <span>日期：</span>
        <RangePicker
          format={dateFormat} 
          allowClear 
          value={state.date} 
          onChange={(date: any) => setState({ date })} 
        />
        <Button type="primary" onClick={() => tableRef.current.getTableData() }>查询</Button>
        <Button onClick={() => setState({ modalVisible: true, currentRow: null })}>新增</Button>
        <Button onClick={initParams}>重置</Button>
      </div>
      <Table 
        ref={tableRef}
        getTableData={getReminder}
        columns={tableColumns} 
      />
      <CreateReminder 
        visible={state.modalVisible} 
        rowData={state.currentRow}
        onCancel={() => setState({ modalVisible: false })}
        onSuccess={handleModalOnSuccess}
      />
    </div>
  )
}

export default Reminder;
