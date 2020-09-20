import React, { useEffect } from 'react';
import moment from 'moment';
import useKeepState from 'use-keep-state';
import {
  Modal,
  Form,
  Input,
  DatePicker
} from 'antd';
import { serviceCreateReminder, serviceUpdateReminder } from '@/services';
import { isLtTodayTimestamp } from '@/utils';

const { TextArea } = Input;

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (res?: any) => void;
  rowData?: { [propName: string]: any; };
};

interface State {
  confirmLoading: boolean;
}

const initialState: State = {
  confirmLoading: false
};

const CreateReminder: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initialState);

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields();
      const params = {
        date: values.date.valueOf(),
        content: values.content.trim()
      };

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
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }

    if (visible && rowData) {
      form.setFieldsValue({
        date: moment(rowData.date),
        content: rowData.content
      });
    }
  }, [visible, rowData]);

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      forceRender
    >
      <Form form={form}>
        <Form.Item
          name="date"
          label="提醒时间"
          rules={[
            {
              required: true,
              message: "请选择时间"
            }
          ]}
        >
          <DatePicker
            showTime
            allowClear={false}
            disabledDate={isLtTodayTimestamp}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="content"
          label="提醒内容"
          rules={[
            {
              required: true,
              message: "请输入提醒内容"
            }
          ]}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="请输入内容"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(CreateReminder);
