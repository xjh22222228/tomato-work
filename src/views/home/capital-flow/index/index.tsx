import React, { useState, useEffect, useCallback, useRef, useReducer, Fragment } from 'react';
import './style.scss';
import { DatePicker, Button, Select, Tag, Statistic, Input } from 'antd';
import moment from 'moment';
import {
  getCurMonthFirstDay,
  getCurMonthLastDay,
  modalConfirmDelete,
  ONE_DAY_TIMESTAMP
} from '@/utils';
import {
  serviceGetCapitalFlow,
  serviceDeleteCapitalFlow,
  serviceGetCapitalFlowType
} from '@/services';
import Table from '@/components/table';
import { OPTION_TYPES, TypeNames, TypeColors } from '../enum';
import CreateCapitalFlow from '../components/create-capital-flow';

const { Search } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

interface State {
  date: moment.Moment[];
  searchKeyword: string,
  name: string;
  type: any;
  modalVisible: boolean;
  currentRow: null | { [propName: string]: any };
  nameList: any[];
  price: { consumption: number; income: number; };
  expandedRowKeys: string[];
}

const initialState: State = {
  date: [],
  searchKeyword: '',
  name: '',
  type: '',
  modalVisible: false,
  currentRow: null,
  nameList: [],
  price: { consumption: 0, income: 0 },
  expandedRowKeys: []
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
    { title: '类型', dataIndex: 'type', width: 100,
      render: (type: any) => (<Tag color={TypeColors[type]}>{ TypeNames[type] }</Tag>)
    },
    { title: '名称', dataIndex: 'name', width: 100 },
    { title: '参与时间', dataIndex: 'date', width: 220 },
    { title: '金额', dataIndex: 'price' },
    { title: '操作', width: 180,
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 0, row)}>编辑</Button>
          <Button onClick={handleActionButton.bind(null, 1, row)}>删除</Button>
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
    setState({ searchKeyword: '', name: '', date: [startDate, endDate] });
    setTimeout(() => {
      tableRef.current.getTableData();
    }, 100);
  }, [setState]);

  // 获取数据
  const getCapitalFlow = useCallback((params: any) => {
    params = {
      ...params,
      keyword: state.searchKeyword,
      typeNameId: state.name,
      type: state.type,
      startDate: state.date[0].valueOf(),
      endDate: state.date[1].valueOf() + ONE_DAY_TIMESTAMP
    };

    return serviceGetCapitalFlow(params).then(res => {
      if (res.data.success) {
        const data = res.data.data;
        const expandedRowKeys: string[] = [];
        
        res.data.data.rows = res.data.data.rows.map((el: any, idx: number) => {
          el.order = idx + 1;
          el.date = moment(el.date).format('YYYY-MM-DD HH:mm');
          if (el.remarks !== '') {
            expandedRowKeys.push(el.id);
          }
          return el;
        });

        setState({
          price: { income: data.income, consumption: data.consumption },
          expandedRowKeys
        });
      }
      return res;
    });
  }, [state.date, state.searchKeyword, state.name, state.type, setState]);

  // 获取所有类型
  const getCapitalFlowType = useCallback(() => {
    serviceGetCapitalFlowType()
    .then(res => {
      if (res.data.success) {
        const data = res.data.data.map((item: any) => {
          item.optionName = `${TypeNames[item.type]} - ${item.name}`;
          return item;
        }).sort((a: any, b: any) => a.type - b.type);
        setState({ nameList: data });
      }
    });
  }, [setState]);

  const handleActionButton = useCallback((type: number, row: any) => {
    // 编辑
    if (type === 0) {
      setState({ modalVisible: true, currentRow: row });
    } else {
      modalConfirmDelete()
      .then(() => {
        serviceDeleteCapitalFlow(row.id)
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

  // 点击展开图标时触发
  const handleOnExpand = useCallback((expanded: any, record: any) => {
    const expandedRowKeys = [...state.expandedRowKeys];
    if (!expanded) {
      const idx = expandedRowKeys.indexOf(record.id);
      expandedRowKeys.splice(idx, 1);
    } else {
      expandedRowKeys.push(record.id);
    }
    setState({ expandedRowKeys });
  }, [setState, state.expandedRowKeys]);

  useEffect(() => {
    initParams();
    getCapitalFlowType();
  }, [initParams, getCapitalFlowType]);

  return (
    <div className="capital-flow">
      <div className="query-panel">
        <span>查询名称：</span>
        <Select 
          onChange={(value: string) => setState({ name: value })} 
          value={state.name}
        >
          <Option value="">全部</Option>
        {
          state.nameList.map((item: any) => (
            <Option value={item.id} key={item.id}>{ item.name }</Option>
          ))
        }
        </Select>
        {
          !state.name && (
            <Fragment>
              <span>查询类型：</span>
              <Select 
                onChange={(value: string) => setState({ type: value })} 
                value={state.type}
              >
              {
                OPTION_TYPES.map(item => (
                  <Option value={item.value} key={item.value}>{ item.name }</Option>
                ))
              }
              </Select>
            </Fragment>
          )
        }
        <span>日期：</span>
        <RangePicker
          format={dateFormat} 
          allowClear 
          value={state.date} 
          onChange={(date: any) => setState({ date })} 
        />
        <div>
          <Search
            value={state.searchKeyword}
            placeholder="试试搜索备注"
            maxLength={300}
            onChange={e => setState({ searchKeyword: e.target.value })}
            onSearch={() => tableRef.current.getTableData()}
            style={{ width: 260, margin: '10px 15px 0 0' }}
          />
          <Button type="primary" onClick={() => tableRef.current.getTableData()}>查询</Button>
          <Button onClick={() => setState({ modalVisible: true, currentRow: null })}>新增</Button>
          <Button onClick={initParams}>重置</Button>
        </div>
        <div className="poly">
          <div className="item-price">
            <em>收入：￥</em>
            <Statistic value={state.price.income} precision={2} />
          </div>
          <div className="item-price">
            <em>支出：￥</em>
            <Statistic value={state.price.consumption} precision={2} />
          </div>
          <div className="item-price">
            <em>实际收入：￥</em>
            <Statistic value={state.price.income - state.price.consumption} precision={2} />
          </div>
        </div>
      </div>
      <Table 
        ref={tableRef}
        getTableData={getCapitalFlow}
        columns={tableColumns} 
        expandedRowRender={(data: any) => <p className="white-space_pre">{ data.remarks }</p>}
        expandedRowKeys={state.expandedRowKeys}
        onExpand={handleOnExpand}
      />
      <CreateCapitalFlow 
        visible={state.modalVisible} 
        rowData={state.currentRow}
        nameList={state.nameList}
        onCancel={() => setState({ modalVisible: false })}
        onSuccess={handleModalOnSuccess}
      />
    </div>
  )
}

export default Reminder;
