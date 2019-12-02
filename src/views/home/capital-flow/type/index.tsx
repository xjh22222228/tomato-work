import React, { useEffect, useState, useReducer, useCallback } from 'react';
import './style.scss';
import { Table, Button, Tag, message } from 'antd';
import {
  serviceGetCapitalFlowType,
  serviceDeleteCapitalFlowType
} from '@/services';
import { TypeNames, TypeColors } from '../enum';
import moment from 'moment';
import CreateType from '../components/create-type/index';

const initialState = {
  modalVisible: false,
  selectedRowKeys: [],
  loading: false,
  data: [],
  rowData: null
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'setState':
      return {...state, ...action.state};
    default:
      return state;
  }
}

const Type = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [columns] = useState([
    { title: '序号', dataIndex: 'index' },
    { title: '名称', dataIndex: 'name' },
    { title: '类别', render: (rowData: any) => (
      <Tag color={rowData.color}>{ rowData.typeName }</Tag>
    ) },
    { title: '创建时间', dataIndex: 'createdAt' },
    { title: '操作', render: (rowData: any) => (
      <Button onClick={handleEdit.bind(null, rowData)}>编辑</Button>
    ) },
  ]);

  const setState = useCallback(state => {
    dispatch({ type: 'setState', state });
  }, []);

  const onSelectChange = useCallback(selectedRowKeys => {
    setState({ selectedRowKeys });
  }, [setState]);

  const getCapitalFlowType = useCallback(() => {
    serviceGetCapitalFlowType()
    .then(res => {
      if (res.data.success) {
        const handleData = res.data.data.map((item: any, idx: number) => {
          item.index = idx + 1;
          item.typeName = TypeNames[item.type];
          item.color = TypeColors[item.type];
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD hh:mm');
          return item;
        });
        setState({ data: handleData });
      }
    });
  }, [setState]);

  const deleteCapitalFlowType = useCallback(() => {
    const ids = state.selectedRowKeys.join();
    if (!ids) return;
    serviceDeleteCapitalFlowType(ids)
    .then(res => {
      if (res.data.success) {
        getCapitalFlowType();
      }
    });
  }, [state.selectedRowKeys, getCapitalFlowType]);

  const handleOnSuccess = useCallback(() => {
    setState({ modalVisible: false });
    getCapitalFlowType();
  }, [setState, getCapitalFlowType]);

  const handleAdd = useCallback(() => {
    if (state.data.length >= 100) {
      message.warn('类型超出100条');
      return;
    }
    setState({ modalVisible: true, rowData: null });
  }, [state.data, setState]);

  const handleEdit = useCallback((rowData: any) => {
    setState({ modalVisible: true, rowData });
  }, [setState]);

  useEffect(() => {
    getCapitalFlowType();
  }, [getCapitalFlowType]);

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="capital-flow-type">
      <div className="button-group">
        <Button type="danger" onClick={deleteCapitalFlowType}>删除</Button>
        <Button type="primary" onClick={handleAdd}>新增</Button>
      </div>
      <Table 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={state.data} 
        pagination={false}
        rowKey="id"
      />
      <CreateType 
        visible={state.modalVisible} 
        rowData={state.rowData}
        onCancel={() => setState({ modalVisible: false })}
        onSuccess={handleOnSuccess}
      />
    </div>
  )
};

export default Type;
