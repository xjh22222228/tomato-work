/**
 * 主页入口
 */
import React, { useState } from 'react'
import './style.scss'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import { Layout } from 'antd'
import { LOCAL_STORAGE } from '@/constants'
import { Outlet } from 'react-router'
import { isMobile } from '@/utils/index'

const { Content } = Layout
const { SIDEBAR_COLLAPSED } = LOCAL_STORAGE

export interface HomeMainState {
  collapsed?: boolean
  setCollapsed?: () => void
}

function defaultCollapsed() {
  const local = localStorage.getItem(SIDEBAR_COLLAPSED)
  if (local) {
    return Number(localStorage.getItem(SIDEBAR_COLLAPSED)) === 0
  }
  if (isMobile()) {
    return true
  }
  return false
}

const HomeMainPage: React.FC = function () {
  const [collapsed, setCollapsed] = useState(defaultCollapsed())

  function handleToggleCollapsed() {
    setCollapsed(!collapsed)
    localStorage.setItem(SIDEBAR_COLLAPSED, Number(collapsed) + '')
  }

  return (
    <section className="home-main">
      <Layout>
        <Sidebar {...{ collapsed }} />
        <Layout className="home-layout">
          <Header {...{ collapsed, setCollapsed: handleToggleCollapsed }} />
          <Content id="container">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </section>
  )
}

export default HomeMainPage
