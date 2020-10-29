import React, { useEffect } from 'react'
import useKeepState from 'use-keep-state'
import { serviceCreateTodoList, serviceUpdateTodoList } from '@/services'
import {
  Modal,
  Form,
  Input
} from 'antd'

type Props = {
  visible: boolean
  rowData?: { [key: string]: any } | null
  onSuccess: (res?: any) => void
  onCancel: () => void
}

const { TextArea } = Input
const initialState = {
  confirmLoading: false,
  content: '',
}

const CreateTodo: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params = {
        content: values.content.trim(),
      };

      (
        !rowData
          ? serviceCreateTodoList(params)
            : serviceUpdateTodoList(rowData.id, params)
      )
      .then(res => {
        if (res.data.success) {
          onSuccess()
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (visible && rowData) {
      form.setFieldsValue({
        content: rowData.content
      })
    }
  }, [visible, rowData])

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  }, [visible])

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
          label="活动内容"
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
            value={state.content}
            onChange={e => setState({ content: e.target.value })}
            maxLength={250}
            placeholder="请输入内容"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTodo)
