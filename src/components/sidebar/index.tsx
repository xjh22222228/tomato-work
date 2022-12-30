import React, { useEffect, useState, useMemo } from 'react'
import './style.scss'
import config from '@/config'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeMainState } from '@/views/main/index'
import { HOME_SIDER_MENU_LIST } from '@/constants'
import logoImage from '@/assets/img/common/logo.png'

const { Sider } = Layout

type Props = HomeMainState

const Sidebar: React.FC<Props> = function ({ collapsed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState('')
  const [openKeys, setOpenKeys] = useState<string[]>([])

  function handleOpenChange(openKeys: any) {
    setOpenKeys(openKeys)
  }

  useEffect(() => {
    const pathname = location.pathname
    const fragment = pathname.split('/').slice(0, 3)
    const prefixPath = fragment.join('/')
    if (fragment.length === 3) {
      for (let i = 0; i < HOME_SIDER_MENU_LIST.length; i++) {
        const menu = HOME_SIDER_MENU_LIST[i]
        if (Array.isArray(menu.children)) {
          const findIdx = menu.children.findIndex(menu => pathname === menu.path)
          if (findIdx !== -1) {
            setSelectedKeys(menu.children[findIdx].path)
            setOpenKeys([menu.name])
            break
          }
        }
        if (menu.path.indexOf(prefixPath) !== -1) {
          setSelectedKeys(menu.path)
          break
        }
      }
    }
  }, [location.pathname])

  const items: MenuProps['items'] = useMemo(() => {
    return HOME_SIDER_MENU_LIST.map(item => {
      const data: any = {
        key: item.path || item.name,
        icon: item.icon,
        label: item.name
      }
      if (Array.isArray(item.children)) {
        data.children = item.children.map(menu => ({
          key: menu.path,
          label: menu.name
        }))
      }
      return data
    })
  }, [HOME_SIDER_MENU_LIST])

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={190}
      className="sidebar"
    >
      <div className="sider-menu-logo">
        {collapsed ? (
          <img src={logoImage} />
        ) : config.title}
      </div>

      <Menu
        selectedKeys={[selectedKeys]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={onClick}
        mode="inline"
        theme="dark"
        items={items}
      />
    </Sider>
  )
}

export default Sidebar
