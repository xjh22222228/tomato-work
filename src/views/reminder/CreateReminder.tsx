import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import useKeepState from 'use-keep-state'
import {
  Modal,
  Form,
  Input,
  DatePicker
} from 'antd'
import { serviceCreateReminder, serviceUpdateReminder } from '@/services'
import { isBefore, formatDateTime } from '@/utils'

const { TextArea } = Input

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: Record<string, any>
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false
}

const CreateReminder: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params = {
        date: formatDateTime(values.date),
        content: values.content.trim()
      }

      setState({ confirmLoading: true });

      (
        !rowData
          ? serviceCreateReminder(params)
          : serviceUpdateReminder(rowData.id, params)
      )
      .then(res => {
        onSuccess(res)
      })
      .finally(() => {
        setState({ confirmLoading: false })
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (visible && rowData) {
      form.setFieldsValue({
        date: dayjs(rowData.createdAt),
        content: rowData.content
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="新增"
      open={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
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
            disabledDate={isBefore}
            className="w100"
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
            placeholder="请输入"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateReminder)
