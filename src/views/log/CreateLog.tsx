import React, { useState, useEffect, useMemo } from 'react'
import './style.scss'
import config from '@/config'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router'
import { LOG_LIST } from './constants'
import { Form, Input, Button, Select } from 'antd'
import {
  serviceCreateLog,
  serviceUpdateLog,
  serviceGetLogById,
} from '@/services/log'
import { LOCAL_STORAGE } from '@/constants'
import { getAllCompany } from '@/store/companySlice'
import { useAppDispatch, useAppSelector } from '@/hooks'

const { TextArea } = Input

const DEF_COMPANY_ID = localStorage.getItem(LOCAL_STORAGE.COMPANY_ID) || '-1'

const CreateLogPage: React.FC = function () {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const params = useParams()
  const { id } = params
  const isEdit = !!id

  const [typeRecord, setTypeRecord] = useState<Record<string, any>>({})
  const companyAll = useAppSelector((state) => state.company.companyAll)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<Record<string, any>>({})
  const dispatch = useAppDispatch()
  const type = params.type || detail.logType

  const memoizedCompanyAll = useMemo(() => {
    return [
      {
        label: '无',
        value: '-1',
      },
      ...companyAll.map((item) => ({
        label: item.companyName,
        value: item.id,
      })),
    ]
  }, [companyAll])

  function goBack() {
    navigate('/home/log', { replace: true })
  }

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params = {
        logType: Number(type),
        ...detail,
        doneContent: values.doneContent,
        undoneContent: values.undoneContent,
        planContent: values.planContent,
        summaryContent: values.summaryContent,
        companyId: values.companyId,
      }

      setLoading(true)
      localStorage.setItem(LOCAL_STORAGE.COMPANY_ID, params.companyId)
      const httpService = isEdit ? serviceUpdateLog : serviceCreateLog

      httpService(params)
        .then(() => {
          goBack()
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  // 查询详情
  useEffect(() => {
    if (isEdit) {
      serviceGetLogById(id).then((res) => {
        setDetail(res)
        form.setFieldsValue({
          companyId: res.companyId,
          doneContent: res.doneContent,
          undoneContent: res.undoneContent,
          planContent: res.planContent,
          summaryContent: res.summaryContent,
        })
      })
    }
  }, [isEdit])

  useEffect(() => {
    if (type) {
      const res = LOG_LIST.find((item) => Number(item.key) === Number(type))
      if (res) {
        setTypeRecord(res!)
        document.title = `创建${res!.name} - ${config.title}`
      }
    }
  }, [type])

  useEffect(() => {
    dispatch(getAllCompany())
  }, [])

  return (
    <section className="createlog-page">
      <div className="top">
        <LeftOutlined className="icon-arrow" onClick={goBack} />
        <h1 className="title">{typeRecord.name}</h1>
        <div></div>
      </div>

      <Form form={form} preserve={false} layout="vertical">
        <Form.Item
          name="companyId"
          label="所属单位"
          initialValue={detail.companyId ?? DEF_COMPANY_ID}
          rules={[
            {
              required: true,
              message: '请选择',
            },
          ]}
        >
          <Select options={memoizedCompanyAll}></Select>
        </Form.Item>

        <Form.Item name="doneContent" label={typeRecord.doneTitle}>
          <TextArea rows={4} maxLength={1200} placeholder="请输入" showCount />
        </Form.Item>

        <Form.Item name="undoneContent" label={typeRecord.undoneTitle}>
          <TextArea rows={4} maxLength={1200} placeholder="请输入" showCount />
        </Form.Item>

        <Form.Item name="planContent" label={typeRecord.planTitle}>
          <TextArea rows={4} maxLength={1200} placeholder="请输入" showCount />
        </Form.Item>

        <Form.Item name="summaryContent" label={typeRecord.summaryTitle}>
          <TextArea rows={4} maxLength={1200} placeholder="请输入" showCount />
        </Form.Item>
      </Form>

      <div className="footbar">
        <Button onClick={goBack}>取消</Button>
        <Button onClick={handleSubmitForm} type="primary" loading={loading}>
          提交
        </Button>
      </div>
    </section>
  )
}

export default CreateLogPage
