// Copyright 2018-present the xiejiahe. All rights reserved. MIT license.
import React from 'react'
import ReactDOM from 'react-dom'
import './assets/styles/global.scss'
import 'antd/dist/antd.css'
import AppRoute from './router'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import store from '@/store'

moment.locale('zh-cn')

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zh_CN}>
        <AppRoute />
      </ConfigProvider>
    </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('tomato-work-root')
)
