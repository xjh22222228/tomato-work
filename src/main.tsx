// Copyright 2018-present the xiejiahe. All rights reserved. MIT license.
import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/global.scss'
import AppRoute from './router'
import 'antd/dist/reset.css'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import zh from 'dayjs/locale/zh-cn'
import store from '@/store'

// https://ant.design/docs/react/v5-for-19-cn antd@v6 移除
import '@ant-design/v5-patch-for-react-19'

dayjs.locale(zh)

const root = ReactDOM.createRoot(
  document.getElementById('tomato-work-root') as HTMLElement,
)

root.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <AppRoute />
    </ConfigProvider>
  </Provider>,
)
