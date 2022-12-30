import React, { Suspense, useEffect, useState, useMemo } from 'react'
import './style.scss'
import { Layout, Menu } from 'antd'
import { useLocation, Outlet, useNavigate } from 'react-router-dom'
import { SETTING_SIDER_MENU_LIST } from '@/constants'
import type { MenuProps } from 'antd'

const { Content, Sider } = Layout

const SettingIndexPage: React.FC = function () {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState('')

  useEffect(() => {
    for (let i = 0; i < SETTING_SIDER_MENU_LIST.length; i++) {
      if (SETTING_SIDER_MENU_LIST[i].path === location.pathname) {
        setSelectedKeys(SETTING_SIDER_MENU_LIST[i].path)
        break
      }
    }
  }, [location.pathname])

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  const items: MenuProps['items'] = useMemo(() => {
    return SETTING_SIDER_MENU_LIST.map(item => {
      const data: any = {
        key: item.path || item.name,
        label: item.name
      }
      return data
    })
  }, [SETTING_SIDER_MENU_LIST])

  return (
    <Layout className="setting-page">
      <Sider width={170}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKeys]}
          style={{ height: '100%' }}
          items={items}
          onClick={onClick}
        >
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
