import React from 'react'
import useKeepState from 'use-keep-state'
import { serviceCreateTodoList, serviceUpdateTodoList } from '@/services'
import {
  Modal,
  Form,
  Input
} from 'antd'

type Props = {
  visible: boolean
  rowData?: Record<string, any> | null
  onSuccess: () => void
  onCancel: () => void
}

const { TextArea } = Input
const initialState = {
  confirmLoading: false,
  content: '',
}

const CreateTodoModal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      setState({ confirmLoading: true })
      const values = await form.validateFields()
      const params = {
        content: values.content.trim(),
      };

      (
        !rowData
          ? serviceCreateTodoList(params)
            : serviceUpdateTodoList(rowData.id, params)
      )
        .then(() => {
          onSuccess()
        })
        .finally(() => {
          setState({ confirmLoading: false })
        })
    } catch (error) {
      console.log(error)
    }
  }

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
          label="活动内容"
          name="content"
          initialValue={rowData?.content}
          rules={[
            {
              required: true,
              message: "请输入内容"
            }
          ]}
        >
          <TextArea
            rows={6}
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

export default React.memo(CreateTodoModal)
