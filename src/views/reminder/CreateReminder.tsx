import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Modal, Form, Input, DatePicker } from 'antd'
import { serviceCreateReminder, serviceUpdateReminder } from '@/services'
import { isBefore, formatDateTime } from '@/utils'

const { TextArea } = Input

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: Record<string, any>
}

const CreateReminder: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params = {
        date: formatDateTime(values.date),
        content: values.content.trim(),
        type: 1, // 未提醒
      }

      setSubmitting(true)
      ;(!rowData
        ? serviceCreateReminder(params)
        : serviceUpdateReminder(rowData.id, params)
      )
        .then((res) => {
          onSuccess(res)
        })
        .finally(() => {
          setSubmitting(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (visible && rowData) {
      form.setFieldsValue({
        date: dayjs(rowData.createdAt),
        content: rowData.content,
      })
    }
  }, [visible, rowData])

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
          name="date"
          label="提醒时间"
          rules={[
            {
              required: true,
              message: '请选择时间',
            },
          ]}
        >
          <DatePicker
            showTime
            allowClear={false}
            disabledDate={isBefore}
            className="!w-full"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="提醒内容"
          rules={[
            {
              required: true,
              message: '请输入提醒内容',
            },
          ]}
        >
          <TextArea rows={3} maxLength={200} placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateReminder)
