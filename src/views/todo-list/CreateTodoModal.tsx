import React, { useState } from 'react'
import { serviceCreateTodoList, serviceUpdateTodoList } from '@/services'
import { Modal, Form, Input } from 'antd'

type Props = {
  visible: boolean
  rowData?: Record<string, any> | null
  onSuccess: () => void
  onCancel: () => void
}

const { TextArea } = Input

const CreateTodoModal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData,
}) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmitForm() {
    try {
      setSubmitting(true)
      const values = await form.validateFields()
      const params = {
        content: values.content.trim(),
      }

      ;(!rowData
        ? serviceCreateTodoList(params)
        : serviceUpdateTodoList(rowData.id, params)
      )
        .then(() => {
          onSuccess()
        })
        .finally(() => {
          setSubmitting(false)
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
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <Form.Item
          label="活动内容"
          name="content"
          initialValue={rowData?.content || ''}
          rules={[
            {
              required: true,
              message: '请输入内容',
            },
          ]}
        >
          <TextArea rows={6} maxLength={250} placeholder="请输入内容" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTodoModal)
