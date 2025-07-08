import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Modal, Form, Input, DatePicker, message } from 'antd'
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
      if (!values.date && !values.cron) {
        message.error('请选择日期或填写Cron表达式定时任务')
        return
      }
      const params = {
        date: values.date ? formatDateTime(values.date) : null,
        content: values.content.trim(),
        cron: values.cron,
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
        date: rowData.date ? dayjs(rowData.date) : undefined,
        content: rowData.content,
        cron: rowData.cron,
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
      destroyOnHidden
    >
      <Form layout="vertical" form={form} preserve={false}>
        <Form.Item name="date" label="提醒时间">
          <DatePicker
            showTime
            allowClear={false}
            disabledDate={isBefore}
            className="!w-full"
          />
        </Form.Item>

        <Form.Item name="cron" label="cron表达式">
          <Input maxLength={20} placeholder="Cron表达式" />
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
