import React from 'react';
import useKeepState from 'use-keep-state';
import { isLtTodayTimestamp } from '@/utils';
import { serviceCreateTask } from '@/services';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Rate
} from 'antd';

type Props = {
  visible: boolean;
  data?: object;
  onSuccess: (res?: any) => void;
  onCancel: () => void;
};

const { TextArea } = Input;
const initialState = {
  confirmLoading: false,
};

const CreateTaskModal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initialState);

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields();
      const params = {
        date: values.date.valueOf(),
        content: values.content.trim(),
        count: values.count
      };

      setState({ confirmLoading: true });

      serviceCreateTask(params)
        .then(res => {
          if (res.data.success) {
            onSuccess();
          }
        })
        .finally(() => {
          setState({ confirmLoading: false });
        });
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

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
          label="开始日期"
          name="date"
          rules={[
            {
              required: true,
              message: "请选择日期"
            }
          ]}
        >
          <DatePicker
            allowClear={false}
            disabledDate={isLtTodayTimestamp}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="任务内容"
          name="content"
          rules={[
            {
              required: true,
              message: "请输入内容"
            }
          ]}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="请输入内容"
          />
        </Form.Item>
        <Form.Item
          label="优先级别"
          name="count"
          rules={[
            {
              required: true,
              message: "请选择优先级"
            }
          ]}
        >
          <Rate />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(CreateTaskModal);
