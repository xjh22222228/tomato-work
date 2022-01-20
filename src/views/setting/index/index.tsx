import React, { Suspense, useEffect, useState } from 'react'
import './style.scss'
import { Layout, Menu } from 'antd'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { SETTING_SIDER_MENU_LIST } from '@/constants'

const { Content, Sider } = Layout

const SettingIndexPage: React.FC = function () {
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = useState('')

  useEffect(() => {
    for (let i = 0; i < SETTING_SIDER_MENU_LIST.length; i++) {
      if (SETTING_SIDER_MENU_LIST[i].path === location.pathname) {
        setSelectedKeys(SETTING_SIDER_MENU_LIST[i].path)
        break
      }
    }
  }, [location.pathname])

  return (
    <Layout className="setting-page">
      <Sider width={170}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKeys]}
          style={{ height: '100%' }}
        >
          {SETTING_SIDER_MENU_LIST.map(menu => (
            <Menu.Item key={menu.path}>
              <Link to={menu.path}>{menu.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content style={{ padding: '0 50px 0 30px' }}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Content>
    </Layout>
  )
}

export default SettingIndexPage
