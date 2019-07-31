import React, { useState, useCallback } from 'react';
import './style.scss';
import { Layout } from 'antd';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { LOCAL_STORAGE } from '@/constants';

const { Content } = Layout;

export interface HomeMainState {
  collapsed?: boolean;
  setCollapsed?: () => void;
}

const storageCollapsed = window.localStorage.getItem(LOCAL_STORAGE.SIDEBAR_COLLAPSED);

const HomeMain: React.FC = function (props) {
  const [collapsed, setCollapsed] = useState(!!storageCollapsed);

  const handleToggleCollapsed = useCallback(() => {
    setCollapsed(collapsed => !collapsed);
    window.localStorage.setItem(LOCAL_STORAGE.SIDEBAR_COLLAPSED, Number(collapsed) + '');
  }, [collapsed]);
  
  return (
    <section className="home-main">
      <Layout>
        <Sidebar {...{ collapsed }} />
        <Layout className="home-layout">
          <Header {...{ collapsed, setCollapsed: handleToggleCollapsed }}  />
          <Content id="container">
            { React.Children.map(props.children, child => child) }
          </Content>
        </Layout>
      </Layout>
    </section>
  );
};

const mapStateToProps = ({ user }: StoreState) => {
  return { userInfo: user.userInfo };
}

export default connect(mapStateToProps)(HomeMain);
