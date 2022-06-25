import React, { useEffect } from 'react'
import moment from 'moment'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber
} from 'antd'
import { serviceCreateCapitalFlow, serviceUpdateCapitalFlow } from '@/services'
import useKeepState from 'use-keep-state'
import { filterOption, FORMAT_DATETIME } from '@/utils'

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
}

const initialState: State = {
  confirmLoading: false,
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
        price: Number(values.amount)
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

  useEffect(() => {
    if (visible) {
      if (rowData) {
        form.setFieldsValue({
          date: moment(rowData.createdAt),
          remark: rowData.remark,
          typeId: rowData.typeId,
          amount: rowData.price,
        })
      } else {
        form.setFieldsValue({
          date: moment()
        })
      }
    }
  }, [visible, rowData])

  return (
    <Modal
      title="新增"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
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
      </Form>
    </Modal>
  )
}

export default React.memo(CreateCapitalFlowModal)
