import React, { Suspense, useEffect, useState } from 'react';
import './style.scss';
import PrivateRoute from '@/components/private-route/index';
import SuspenseFallback from '@/components/suspense-fallback/index';
import { Layout, Menu } from 'antd';
import { Switch, Link, RouteComponentProps } from 'react-router-dom';
import { SETTING_SIDER_MENU_LIST } from '@/constants';
import { settingRoutes } from '@/router/routes';

const { Content, Sider } = Layout;

const SettingIndex: React.FC<RouteComponentProps> = function ({ location }) {
  const [selectedKeys, setSelectedKeys] = useState('');

  useEffect(() => {
    for (let i = 0; i < SETTING_SIDER_MENU_LIST.length; i++) {
      if (SETTING_SIDER_MENU_LIST[i].path === location.pathname) {
        setSelectedKeys(SETTING_SIDER_MENU_LIST[i].path);
        break;
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
        <Suspense fallback={SuspenseFallback()}>
          <Switch>
            {settingRoutes.map((route, idx) => (
              <PrivateRoute {...route} key={idx} />
            ))}
          </Switch>
        </Suspense>
      </Content>
    </Layout>
  )
};

export default SettingIndex;
