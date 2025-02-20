/**
 * 账号设置
 */
import React, { useEffect } from 'react'
import md5 from 'blueimp-md5'
import {
  serviceUpdateUser,
  serviceGetUserConfig,
  serviceUpdateUserConfig,
} from '@/services'
import { Form, Input, Button, Divider } from 'antd'
import { useAppSelector } from '@/hooks'

const AccountPage: React.FC = function () {
  const [form] = Form.useForm()
  const [form2] = Form.useForm()
  const userInfo = useAppSelector((state) => state.user.userInfo)

  async function handleUpdateUser() {
    try {
      const values = await form.validateFields()
      serviceUpdateUser({ password: md5(values.password) })
    } catch (err) {
      console.log(err)
    }
  }

  async function handleSckey() {
    try {
      const values = await form2.validateFields()
      serviceUpdateUserConfig({ sckey: values.sckey })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    serviceGetUserConfig().then((res) => {
      form2.setFieldsValue({
        sckey: res?.serverChanSckey || '',
      })
    })
  }, [])

  return (
    <div className="account-setting">
      <Divider orientation="left" plain>
        修改密码
      </Divider>
      <Form layout="vertical" form={form} style={{ width: 300 }}>
        <Form.Item
          label="登录名"
          name="name"
          initialValue={userInfo.loginName}
          rules={[{ required: true }]}
        >
          <Input readOnly disabled />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
            {
              pattern: /.{6,}/,
              message: '新密码至少6位',
            },
          ]}
        >
          <Input type="password" maxLength={32} />
        </Form.Item>

        <br />

        <Form.Item>
          <Button type="primary" onClick={handleUpdateUser}>
            提交
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" plain>
        企业微信机器人
      </Divider>

      <Form layout="vertical" form={form2} style={{ width: 300 }}>
        <Form.Item
          label="Webhook Key"
          name="sckey"
          rules={[
            {
              required: true,
              message: '请正确填写 KEY',
            },
          ]}
        >
          <Input.Password maxLength={100} />
        </Form.Item>
        <div style={{ textAlign: 'right', marginTop: 5 }}>
          <a
            href="https://open.work.weixin.qq.com/help2/pc/14931"
            target="_blank"
            rel="noopener noreferrer"
          >
            如何获取？
          </a>
        </div>
        <Form.Item>
          <Button type="primary" onClick={handleSckey}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AccountPage
