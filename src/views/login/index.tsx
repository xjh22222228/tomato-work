// https://007.qq.com/quick-start.html?ADTAG=acces.cfg
import React, { useState, useEffect, useMemo } from 'react'
import './style.scss'
import Footer from '@/components/footer'
import qs from 'query-string'
import md5 from 'blueimp-md5'
import config from '@/config'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import { Button, Input, message, Popover, Form } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginByToken, SET_USER_INFO } from '@/store/userSlice'
import { serviceLogin } from '@/services'
import { LOCAL_STORAGE } from '@/constants'
import { randomCode } from '@/utils'
import { useAppDispatch } from '@/hooks'
import {
  PictureOutlined,
  LockOutlined,
  UserOutlined,
  GithubOutlined,
} from '@ant-design/icons'

const PopoverContent = (
  <div style={{ padding: '10px 20px 10px 20px' }}>
    <div>本站不开放注册账号，首次登陆请使用GitHub</div>
    <div>登陆后系统将自动注册账号, 密码为123456</div>
  </div>
)

let captcha = randomCode()
const LOGIN_NAME = localStorage.getItem(LOCAL_STORAGE.LOGIN_NAME) || ''

const captchaUrl = config.http.baseURL + '/captcha?code='

function reloadCaptcha(e: any) {
  captcha = randomCode()
  const url = captchaUrl + captcha
  e.target.src = url
}

export default function () {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const redirectUrl = useMemo(() => {
    const url = qs.parse(location.search).redirectUrl as string
    return url || '/home/index'
  }, [])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)
      serviceLogin({
        loginName: values.loginName.trim(),
        password: md5(values.password.trim()),
        code: values.code.trim(),
      })
        .then((res) => {
          setLoading(false)
          dispatch(SET_USER_INFO(res.userInfo))
          navigate(redirectUrl, { replace: true })
        })
        .catch(() => {
          setLoading(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  const goGithubAuth = () => {
    setLoading(true)
    const url = `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${config.github.callbackURL}&client_id=${config.github.clientId}&scope=read:user`
    window.location.replace(url)
  }

  useEffect(() => {
    const query = qs.parse(location.search)
    const { token, state } = query

    if (Number(state) === 0) {
      message.error('授权失败，请重新登录')
      return
    }

    if (token) {
      dispatch(loginByToken(token as string)).then((res: any) => {
        if (!isEmpty(res.userInfo)) {
          navigate(redirectUrl, { replace: true })
        }
      })
    }
  }, [history, location.search])

  useEffect(() => {
    if (config.isDevelopment) {
      form.setFieldsValue({
        loginName: 'test',
        password: '123456',
      })
    }
  }, [])

  return (
    <section className="login-page">
      <a
        href={config.github.repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 250 250"
          className="svg-wrapper"
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            className="octo-arm"
          ></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
          ></path>
        </svg>
      </a>

      <div className="wrap">
        <div>
          <div className="logo-wrap">
            <img src="/logo.svg" className="logo" alt="" />
            <em>{config.title}</em>
          </div>

          <Form form={form}>
            <Form.Item
              name="loginName"
              initialValue={LOGIN_NAME}
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                placeholder="用户名"
                prefix={<UserOutlined />}
                maxLength={32}
                autoComplete="off"
                onPressEnter={handleSubmit}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input
                placeholder="密码"
                prefix={<LockOutlined />}
                maxLength={32}
                type="password"
                autoComplete="off"
                onPressEnter={handleSubmit}
              />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
                {
                  pattern: /.{4}/,
                  message: '请输入正确验证码',
                },
              ]}
            >
              <Input
                placeholder="请输入验证码"
                prefix={<PictureOutlined />}
                maxLength={4}
                autoComplete="off"
                onPressEnter={handleSubmit}
                suffix={
                  <img
                    src={`${captchaUrl}${captcha}`}
                    className="captcha"
                    onClick={reloadCaptcha}
                    alt=""
                  />
                }
              />
            </Form.Item>
          </Form>

          <div
            className={classNames('login-bar', {
              'events-none': loading,
            })}
          >
            <GithubOutlined onClick={goGithubAuth} />
          </div>

          <Button
            type="primary"
            style={{ marginTop: '20px' }}
            size="large"
            loading={loading}
            block
            onClick={handleSubmit}
          >
            {loading ? '登 录 中...' : '登 录'}
          </Button>
          <div className="register">
            <Popover
              content={PopoverContent}
              trigger="hover"
              placement="bottomRight"
            >
              <span>注册账号</span>
            </Popover>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}
