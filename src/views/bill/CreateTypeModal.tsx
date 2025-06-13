import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { serviceCreateBillType, serviceUpdateBillType } from '@/services'
import { TYPES } from './enum'

type Props = {
  visible: boolean
  onSuccess: (res?: any) => void
  onCancel: () => void
  rowData: null | Record<string, any>
}

const CreateTypeModal: React.FC<Props> = function ({
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
        type: values.type,
        name: values.name.trim(),
      }

      setSubmitting(true)
      ;(rowData
        ? serviceUpdateBillType(rowData.id, params)
        : serviceCreateBillType(params)
      )
        .then((res) => {
          onSuccess(res.data)
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
        name: rowData.name,
        type: rowData.type,
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="新增类别"
      open={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form form={form} preserve={false}>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入类别名称',
            },
          ]}
        >
          <Input maxLength={20} placeholder="请输入类别名称" />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
          rules={[
            {
              required: true,
              message: '请选择类型',
            },
          ]}
        >
          <Select options={TYPES}></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTypeModal)
