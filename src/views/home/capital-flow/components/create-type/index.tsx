import React, { useCallback, useReducer, useEffect } from 'react';
import { 
  Modal,
  Form,
  Input,
  message,
  Select
} from 'antd';
import { serviceCreateCapitalFlowType, serviceUpdateCapitalFlowType } from '@/services';
import { TYPES } from '../../enum';

type Props = {
  visible: boolean;
  onSuccess: (res?: any) => void;
  onCancel: () => void;
  rowData: null | { [propName: string]: any; }
};

const { Option } = Select;
const defaultType = TYPES.length ? TYPES[0].value : null;
const initialState = {
  confirmLoading: false,
  name: '',
  type: defaultType
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const CreateTask: React.FC<Props> = function ({ visible, rowData, onCancel, onSuccess }) {
  const [state, dispatch] = useReducer(reducer, initialState); 

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state });
  }, []);

  // 提交表单
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const name = state.name.trim();
    const params = { type: state.type, name };

    if (!name) {
      message.warn('名称不能为空');
      return;
    }

    setState({ confirmLoading: true });

    (rowData 
      ? serviceUpdateCapitalFlowType(rowData.id, params) 
        : serviceCreateCapitalFlowType(params)
    )
    .then(res => {
      if (res.data.success) {
        onSuccess(res.data.data);
      }
    })
    .finally(() => {
      setState({ confirmLoading: false });
    });
  }, [state, rowData, onSuccess, setState]);

  useEffect(() => {
    // 每次rowData改变重新赋值
    if (rowData) {
      setState({ name: rowData.name, type: rowData.type });
    } else {
      setState({ name: '', type: defaultType });
    }
  }, [rowData, setState]);

  return (
    <Modal
      title="新增类别"
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => onCancel()}
      confirmLoading={state.confirmLoading}
    >
      <Form onSubmit={handleSubmit} layout="inline">
        <Form.Item label="名称">
          <Input 
            value={state.name} 
            onChange={e => setState({ name: e.target.value })} 
            maxLength={20} 
            placeholder="请输入名称"
          />
        </Form.Item>
        <Form.Item label="类型">
          <Select 
            value={state.type} 
            onChange={(value: any) => setState({ type: value })}
          >
          {TYPES.map(item => (
            <Option value={item.value} key={item.value}>{item.name}</Option>
          ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default React.memo(CreateTask);
