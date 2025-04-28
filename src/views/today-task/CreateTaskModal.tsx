import React, { useState } from 'react'
import { isBefore } from '@/utils'
import { serviceCreateTask } from '@/services'
import { Modal, Form, Input, DatePicker, Rate } from 'antd'
import dayjs from 'dayjs'

type Props = {
  visible: boolean
  onOk(): void
  onCancel(): void
}

const { TextArea } = Input

const CreateTaskModal: React.FC<Props> = function ({
  visible,
  onOk,
  onCancel,
}) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params = {
        date: dayjs(values.date).valueOf(),
        content: values.content.trim(),
        count: values.count,
      }

      setSubmitting(true)

      serviceCreateTask(params)
        .then(() => {
          onOk()
        })
        .finally(() => {
          setSubmitting(false)
        })
    } catch (err) {
      console.log(err)
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
          label="开始日期"
          name="date"
          rules={[
            {
              required: true,
              message: '请选择日期',
            },
          ]}
        >
          <DatePicker
            allowClear={false}
            disabledDate={isBefore}
            className="w100"
          />
        </Form.Item>

        <Form.Item
          label="任务内容"
          name="content"
          rules={[
            {
              required: true,
              message: '请输入内容',
            },
          ]}
        >
          <TextArea rows={3} maxLength={200} placeholder="请输入内容" />
        </Form.Item>

        <Form.Item
          label="优先级别"
          name="count"
          initialValue={5}
          rules={[
            {
              required: true,
              message: '请选择优先级',
            },
          ]}
        >
          <Rate />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTaskModal)
