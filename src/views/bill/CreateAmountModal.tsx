import React, { useEffect, useState, useMemo, useImperativeHandle } from 'react'
import type { Ref } from 'react'
import dayjs from 'dayjs'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Upload,
} from 'antd'
import type { UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  serviceCreateBill,
  serviceUpdateBill,
  serviceGetAmountById,
} from '@/services'
import { FORMAT_DATETIME, base64ToBlob } from '@/utils'
import { cloneDeep } from 'lodash'

const { TextArea } = Input

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

type Props = {
  ref: Ref<any>
  visible: boolean
  onCancel: () => void
  onOk: (res?: any) => void
  rowData: Record<string, any> | null
  enterTypes: any[]
  outTypes: any[]
}

interface State {
  confirmLoading: boolean
  fileList: UploadFile[]
}

const initialState: State = {
  confirmLoading: false,
  fileList: [],
}

const CreateBillModal: React.FC<Props> = function ({
  ref,
  visible,
  onCancel,
  onOk,
  rowData,
  enterTypes,
  outTypes,
}) {
  const [form] = Form.useForm()
  const [state, setState] = useState<State>(initialState)

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      const params = {
        date: values.date.format(FORMAT_DATETIME),
        remark: values.remark?.trim() ?? '',
        typeId: values.typeId,
        price: Number(values.amount),
        imgs: '',
      }

      if (state.fileList.length > 0) {
        params.imgs = state.fileList[0].thumbUrl ?? ''
      }

      setState((prev) => ({ ...prev, confirmLoading: true }))
      ;(!rowData
        ? serviceCreateBill(params)
        : serviceUpdateBill(rowData.id, params)
      )
        .then((res) => {
          onOk(res)
        })
        .finally(() => {
          setState((prev) => ({ ...prev, confirmLoading: false }))
        })
    } catch (err) {
      console.log(err)
    }
  }

  function handleChange({ fileList }: any) {
    fileList = cloneDeep(fileList)
    if (fileList.length > 0) {
      fileList[0].status = 'done'
    }
    setState((prev) => ({ ...prev, fileList }))
  }

  function handleOpen() {}

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }))

  useEffect(() => {
    if (visible) {
      setState((prev) => ({ ...prev, fileList: [] }))
      if (rowData) {
        setState((prev) => ({ ...prev, confirmLoading: true }))
        serviceGetAmountById(rowData.id).then((res) => {
          form.setFieldsValue({
            date: dayjs(res.createdAt),
            remark: res.remark,
            typeId: res.typeId,
            amount: res.price,
          })
          const state: State = {
            fileList: [],
            confirmLoading: false,
          }
          if (res.imgs) {
            state.fileList = [
              {
                name: 'image.png',
                url: res.imgs,
                thumbUrl: res.imgs,
                status: 'done',
                uid: '-1',
              },
            ]
          }
          setState(state)
        })
      } else {
        form.setFieldsValue({
          date: dayjs(),
        })
      }
    }
  }, [visible, rowData])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )

  function requestUpload() {
    // pass
  }

  function onPreview(file: UploadFile) {
    const blob = base64ToBlob(file.thumbUrl as string)
    const url = URL.createObjectURL(blob)
    window.open(url)
    setTimeout(() => {
      URL.revokeObjectURL(url)
    })
  }

  const selectOptions = useMemo(() => {
    const options = [
      {
        title: '收入',
        label: '收入',
        options: enterTypes.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      },
      {
        title: '支出',
        label: '支出',
        options: outTypes.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      },
    ]
    return options
  }, [enterTypes, outTypes])

  return (
    <Modal
      title="新增"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnHidden
    >
      <Form form={form} preserve={false} {...formLayout}>
        <Form.Item
          label="入账时间"
          name="date"
          rules={[
            {
              required: true,
              message: '请选择时间',
            },
          ]}
        >
          <DatePicker showTime allowClear={false} className="!w-full" />
        </Form.Item>

        <Form.Item
          label="财务类别"
          name="typeId"
          rules={[
            {
              required: true,
              message: '请选择类别',
            },
          ]}
        >
          <Select options={selectOptions}></Select>
        </Form.Item>

        <Form.Item
          label="收支金额"
          name="amount"
          rules={[
            {
              required: true,
              message: '请输入金额',
            },
          ]}
        >
          <InputNumber
            className="!w-full"
            placeholder="请输入金额"
            formatter={(value) => `￥ ${value}`}
            max={9999999}
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item label="备注信息" name="remark">
          <TextArea rows={5} maxLength={250} />
        </Form.Item>

        <Form.Item label="附件" name="imgs">
          <Upload
            listType="picture-card"
            fileList={state.fileList}
            onChange={handleChange}
            customRequest={requestUpload}
            onPreview={onPreview}
          >
            {state.fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateBillModal)
