import React, { useEffect } from 'react';
import moment from 'moment';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select
} from 'antd';
import { serviceCreateCapitalFlow, serviceUpdateCapitalFlow } from '@/services';
import useKeepState from 'use-keep-state';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const { TextArea } = Input;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (res?: any) => void;
  rowData?: { [key: string]: any; };
  nameList: any[];
};

interface State {
  confirmLoading: boolean;
}

const initialState: State = {
  confirmLoading: false,
};

const CreateReminder: React.FC<Props> = function ({
  visible,
  onCancel,
  onSuccess,
  rowData,
  nameList
}) {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initialState);

  async function handleSubmit() {
    try {
      const values = await form.validateFields();
      const params = {
        date: values.date.format(DATE_FORMAT),
        remarks: values.remarks?.trim() ?? '',
        typeId: values.typeId,
        price: Number(values.price)
      };

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
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (visible && rowData) {
      form.setFieldsValue({
        date: moment(rowData.date),
        remarks: rowData.remarks,
        typeId: rowData.typeId,
        price: rowData.price,
      });
    }
  }, [visible, rowData]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      forceRender
    >
      <Form form={form} {...formLayout}>
        <Form.Item
          label="入账时间"
          name="date"
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
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="财务类别"
          name="typeId"
          rules={[
            {
              required: true,
              message: "请选择类别"
            }
          ]}
        >
          <Select>
            {nameList.map((item: any) => (
              <Option value={item.id} key={item.id}>{item.optionName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="收支金额"
          name="price"
          rules={[
            {
              required: true,
              message: "请输入金额"
            }
          ]}
        >
          <Input placeholder="请输入金额" prefix="￥" />
        </Form.Item>
        <Form.Item
          label="备注信息"
          name="remarks"
        >
          <TextArea
            rows={5}
            maxLength={250}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(CreateReminder);
