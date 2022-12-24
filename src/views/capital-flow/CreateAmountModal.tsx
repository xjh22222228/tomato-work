import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Upload
} from 'antd'
import type { UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { serviceCreateCapitalFlow, serviceUpdateCapitalFlow, serviceGetAmountById } from '@/services'
import useKeepState from 'use-keep-state'
import { filterOption, FORMAT_DATETIME, base64ToBlob } from '@/utils'
import { cloneDeep } from 'lodash'

const { TextArea } = Input
const { Option, OptGroup } = Select

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: Record<string, any>
  enterTypes: any[]
  outTypes: any[]
}

interface State {
  confirmLoading: boolean
  fileList: UploadFile[]
}

const initialState: State = {
  confirmLoading: false,
  fileList: []
}

const CreateCapitalFlowModal: React.FC<Props> = function ({
  visible,
  onCancel,
  onSuccess,
  rowData,
  enterTypes,
  outTypes
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      const params = {
        date: values.date.format(FORMAT_DATETIME),
        remark: values.remark?.trim() ?? '',
        typeId: values.typeId,
        price: Number(values.amount),
        imgs: ''
      }

      if (state.fileList.length > 0) {
        params.imgs = state.fileList[0].thumbUrl
      }

      setState({ confirmLoading: true });

      (
        !rowData
          ? serviceCreateCapitalFlow(params)
          : serviceUpdateCapitalFlow(rowData.id, params)
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

  function handleChange({ fileList }: any) {
    fileList = cloneDeep(fileList)
    if (fileList.length > 0) {
      fileList[0].status = 'success'
    }
    setState({ fileList })
  }

  useEffect(() => {
    if (visible) {
      setState({ fileLst: [] })
      if (rowData) {
        setState({ confirmLoading: true })
        serviceGetAmountById(rowData.id).then(res => {
          form.setFieldsValue({
            date: dayjs(res.createdAt),
            remark: res.remark,
            typeId: res.typeId,
            amount: res.price,
          })
          const state: Record<string, any> = {
            fileList: [],
            confirmLoading: false
          }
          if (res.imgs) {
            state.fileList = [{
              url: res.imgs,
              thumbUrl: res.imgs,
              status: 'success',
              uid: '-1'
            }]
          }
          setState(state)
        })
      } else {
        form.setFieldsValue({
          date: dayjs()
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

  return (
    <Modal
      title="新增"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading || state.loading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayout}>
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
            className="w100"
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
          <Select
            showSearch
            filterOption={filterOption}
          >
            <OptGroup label="收入">
              {enterTypes.map((item: any) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </OptGroup>
            <OptGroup label="支出">
              {outTypes.map((item: any) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </OptGroup>
          </Select>
        </Form.Item>

        <Form.Item
          label="收支金额"
          name="amount"
          rules={[
            {
              required: true,
              message: "请输入金额"
            }
          ]}
        >
          <InputNumber
            className="w100"
            placeholder="请输入金额"
            formatter={value => `￥ ${value}`}
            max={9999999}
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          label="备注信息"
          name="remark"
        >
          <TextArea
            rows={5}
            maxLength={250}
          />
        </Form.Item>

        <Form.Item
          label="附件"
          name="imgs"
        >
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

export default React.memo(CreateCapitalFlowModal)
