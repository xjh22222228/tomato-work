import React, { useEffect, useState, useMemo } from 'react'
import './style.scss'
import config from '@/config'
import { Layout, Menu } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { HomeMainState } from '@/views/main/index'
import { HOME_SIDER_MENU_LIST } from '@/constants'
import logoImage from '@/assets/img/common/logo.png'

const { Sider } = Layout
const { SubMenu } = Menu

type Props = HomeMainState

const Sidebar: React.FC<Props> = function ({ collapsed }) {
  const location = useLocation()
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

  const menuItems = useMemo(() => {
    return HOME_SIDER_MENU_LIST.map(menu => {
      if (Array.isArray(menu.children)) {
        return (
          <SubMenu
            key={menu.name}
            title={
              <>
                {menu.icon}
                <span>{menu.name}</span>
              </>
            }
          >
            {menu.children.map(subItem => (
              <Menu.Item key={subItem.path}>
                <Link to={subItem.path}>{subItem.name}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        )
      }

      return (
        <Menu.Item key={menu.path}>
          <Link to={menu.path}>
            {menu.icon}
            <span>{menu.name}</span>
          </Link>
        </Menu.Item>
      )
    })
  }, [])

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
        mode="inline"
        theme="dark"
      >
        {menuItems}
      </Menu>
    </Sider>
  )
}

export default Sidebar
