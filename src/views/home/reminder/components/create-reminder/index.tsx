import React, { useCallback, useReducer, useEffect } from 'react';
import moment from 'moment';
import { 
  Modal,
  Form,
  Input,
  DatePicker,
  message
} from 'antd';
import { serviceCreateReminder, serviceUpdateReminder } from '@/services';
import { isLtTodayTimestamp } from '@/utils';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const defaultDate = moment(new Date(), dateFormat);

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (res?: any) => void;
  rowData?: { [propName: string]: any; };
};

interface State {
  confirmLoading: boolean;
  dateMode: 'time' | 'date' | 'month' | 'year' | 'decade';
  date: moment.Moment;
  content: string;
}

const initialState: State = {
  confirmLoading: false,
  dateMode: 'date',
  date: defaultDate,
  content: ''
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const CreateReminder: React.FC<Props> = function ({ visible, onCancel, onSuccess, rowData }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state })
  }, []);

  const initParams = useCallback(() => {
    if (!rowData) {
      setState({ content: '' });
    } else {
      setState({
        date: moment(rowData.date, dateFormat),
        content: rowData.content
      });
    }
  }, [setState, rowData]);

  const handleSubmit = useCallback((e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    const params = {
      date: state.date.valueOf(),
      content: state.content.trim()
    };

    try {
      if (!params.content) throw new Error('内容不能为空');
    } catch (err) {
      message.warn(err.message);
      return;
    }

    setState({ confirmLoading: true });

    (
      !rowData 
        ? serviceCreateReminder(params) 
        : serviceUpdateReminder(rowData.id, params)
    )
    .then(res => {
      if (res.data.success) {
        onSuccess(res);
      }
    })
    .finally(() => {
      setState({ confirmLoading: false });
    });

  }, [state, setState, onSuccess, rowData]);

  useEffect(() => {
    initParams();
  }, [visible, initParams]);

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
    >
      <Form onSubmit={handleSubmit} layout="inline">
        <Form.Item label="提醒时间">
          <DatePicker
            mode={state.dateMode}
            showTime
            allowClear={false}
            value={state.date}
            onPanelChange={(value, dateMode) => setState({ dateMode })}
            onChange={date => setState({ date }) }
            disabledDate={isLtTodayTimestamp}
          />
        </Form.Item>
        <Form.Item label="提醒内容">
          <TextArea 
            rows={3} 
            value={state.content} 
            onChange={e => setState({ content: e.target.value })} 
            maxLength={200} 
            placeholder="请输入内容"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default React.memo(CreateReminder);
