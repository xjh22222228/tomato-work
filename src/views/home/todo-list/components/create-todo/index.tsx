import React, { useCallback, useEffect } from 'react';
import useKeepState from 'use-keep-state';
import { serviceCreateTodoList, serviceUpdateTodoList } from '@/services';
import { 
  Modal,
  Form,
  Input,
  message,
} from 'antd';

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

const CreateTodo: React.FC<Props> = function ({
  visible,
  onSuccess,
  setParentState,
  rowData
}) {
  const [state, setState] = useKeepState(initialState); 

  const handleSubmitForm = useCallback(() => {
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
    setState({
      content: rowData ? rowData.content : ''
    });
  }, [rowData, setState]);

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={() => setParentState({ showCreateTodoModal: false })}
      confirmLoading={state.confirmLoading}
    >
      <Form>
        <Form.Item label="活动内容">
          <TextArea 
            rows={3} 
            value={state.content} 
            onChange={e => setState({ content: e.target.value })} 
            maxLength={250} 
          />
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default React.memo(CreateTodo);
