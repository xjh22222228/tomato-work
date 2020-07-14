import React, { useCallback, useReducer } from 'react';
import moment from 'moment';
import { isLtTodayTimestamp } from '@/utils';
import { serviceCreateTask } from '@/services';
import { 
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Rate
} from 'antd';

type Props = {
  visible: boolean;
  data?: object;
  setParentState(state: any): void;
  onSuccess: (res?: any) => void;
};

const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
const initialState = {
  confirmLoading: false,
  content: '',
  date: moment(new Date(), dateFormat),
  count: 5
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const CreateTask: React.FC<Props> = function ({ visible, onSuccess, setParentState }) {
  const [state, dispatch] = useReducer(reducer, initialState); 

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state });
  }, []);

  const handleSubmitForm = useCallback(() => {
    const params = {
      date: state.date.valueOf(),
      content: state.content.trim(),
      count: state.count
    };

    if (!params.content) {
      message.warn('内容不能为空');
      return;
    }

    serviceCreateTask(params)
      .then(res => {
        if (res.data.success) {
          onSuccess();
        }
      });
  }, [state, onSuccess]);

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={() => setParentState({ showCreateTaskModal: false })}
      confirmLoading={state.confirmLoading}
    >
      <Form>
        <Form.Item label="开始日期">
          <DatePicker
            allowClear={false}
            value={state.date}
            onChange={date => setState({ date }) }
            disabledDate={isLtTodayTimestamp}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="任务内容">
          <TextArea 
            rows={3} 
            value={state.content} 
            onChange={e => setState({ content: e.target.value })} 
            maxLength={200} 
            placeholder="请输入内容"
          />
        </Form.Item>
        <Form.Item label="优先级别">
          <Rate value={state.count} onChange={count => setState({ count })} />
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default React.memo(CreateTask);
