import React, { useCallback, useReducer, useEffect, useRef } from 'react';
import moment from 'moment';
import { 
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select
} from 'antd';
import { serviceCreateCapitalFlow, serviceUpdateCapitalFlow } from '@/services';

const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const defaultDate = moment(new Date(), dateFormat);

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (res?: any) => void;
  rowData?: { [propName: string]: any; };
  nameList: any[];
};

interface State {
  confirmLoading: boolean;
  dateMode: 'time' | 'date' | 'month' | 'year' | 'decade';
  date: moment.Moment;
  remarks: string;
  typeId: string;
  price: string | number;
}

const initialState: State = {
  confirmLoading: false,
  dateMode: 'date',
  date: defaultDate,
  remarks: '',
  typeId: '',
  price: ''
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const CreateReminder: React.FC<Props> = function ({
  visible,
  onCancel,
  onSuccess,
  rowData,
  nameList
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initRef = useRef(false);

  const setState = useCallback((state) => {
    dispatch({ type: 'setState', state })
  }, []);

  const initParams = useCallback(() => {
    const params: any = {
      remarks: '',
      typeId: state.typeId || (nameList.length && nameList[0].id),
      price: ''
    };

    if (rowData) {
      params.date = moment(rowData.date, dateFormat);
      params.remarks = rowData.remarks;
      params.typeId = rowData.typeId;
      params.price = rowData.price;
    }
    setState(params);
  }, [setState, rowData, state.typeId, nameList]);

  const handleSubmit = useCallback((e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    const params = {
      date: state.date.valueOf(),
      remarks: state.remarks.trim(),
      typeId: state.typeId,
      price: Number(state.price)
    };

    try {
      if (!params.price || isNaN(params.price)) throw new Error('金额必须为数字');
      if (!params.typeId) throw new Error('请选择名称');
    } catch (err) {
      message.warn(err.message);
      return;
    }

    setState({ confirmLoading: true });

    (
      !rowData 
        ? serviceCreateCapitalFlow(params) 
        : serviceUpdateCapitalFlow(rowData.id, params)
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
    if (visible === initRef.current) return;
    initRef.current = visible;
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
        <Form.Item label="入账时间">
          <DatePicker
            mode={state.dateMode}
            showTime
            allowClear={false}
            value={state.date}
            onPanelChange={(value, dateMode) => setState({ dateMode }) }
            onChange={date => setState({ date }) }
          />
        </Form.Item>
        <Form.Item label="财务类型">
          <Select 
            onChange={(value: string) => setState({ typeId: value })} 
            value={state.typeId}
          >
            {nameList.map((item: any) => (
              <Option value={item.id} key={item.id}>{item.optionName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="收支金额">
          <Input 
            value={state.price} 
            onChange={e => setState({ price: e.target.value })} 
          />
        </Form.Item>
        <Form.Item label="备注信息">
          <TextArea 
            rows={5} 
            value={state.remarks} 
            onChange={e => setState({ remarks: e.target.value })} 
            maxLength={250} 
          />
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default React.memo(CreateReminder);
