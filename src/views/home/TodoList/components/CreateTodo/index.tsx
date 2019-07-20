import React, { useCallback, useReducer, useEffect } from 'react';
import { 
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import { serviceCreateTodoList, serviceUpdateTodoList } from '@/services';

type Props = {
  visible: boolean;
  rowData?: { [propName: string]: any; } | null;
  setParentState(state: any): void;
  onSuccess: (res?: any) => void;
};

const { TextArea } = Input;
const initialState = {
  confirmLoading: false,
  content: '',
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const CreateTodo: React.FC<Props> = function ({
  visible,
  onSuccess,
  setParentState,
  rowData
}) {
  const [state, dispatch] = useReducer(reducer, initialState); 

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state });
  }, []);

  // 初始化
  const init = useCallback(() => {
    if (rowData) {
      setState({ content: rowData.content });
    } else {
      setState({ content: '' });
    }
  }, [rowData, setState]);

  // 提交表单
  const handleSubmit = useCallback(() => {
    const params = {
      content: state.content.trim(),
    };

    if (!params.content) {
      message.warn('内容不能为空');
      return;
    }

    (
      !rowData 
        ? serviceCreateTodoList(params) 
          : serviceUpdateTodoList(rowData.id, params)
    )
    .then(res => {
      if (res.data.success) {
        onSuccess();
      }
    });
  }, [state, onSuccess, rowData]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => setParentState({ showCreateTodoModal: false })}
      confirmLoading={state.confirmLoading}
    >
      <Form onSubmit={handleSubmit} layout="inline">
        <Form.Item label="活动内容">
          <TextArea 
            rows={3} 
            value={state.content} 
            onChange={e => setState({ content: e.target.value })} 
            maxLength={250} 
            placeholder="Todo List"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default React.memo(CreateTodo);
