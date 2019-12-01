import React from 'react';
import './style.scss';
import { Card, Divider } from 'antd';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { UserInfoProps } from '@/store/reducers/user';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Avatar from '@/components/avatar';

const { Meta } = Card;

type Props = {
  userInfo: UserInfoProps;
}

const Base: React.FC<Props & RouteComponentProps> = function ({ userInfo }) {
  
  const MetaDesc = (
    <div className="meta-desc">
      <div>{ userInfo.loginName }</div>
      <div>简介：{ userInfo.bio }</div>
      <div>邮箱：{ userInfo.email }</div>
      <div>地区：{ userInfo.location }</div>
      <div>注册时间：{ userInfo.createdAt }</div>
    </div>
  );

  return (
    <div className="setting-base">
      <Divider orientation="left">个人中心</Divider>
      <Card
        style={{ width: 350 }}
        cover={
          <img
            alt=""
            src={require('@/assets/img/common/user-poster.png')}
            className="poster"
          />
        }
      >
        <Meta
          avatar={<Avatar src={userInfo.avatarUrl} size="large" />}
          title={userInfo.username}
          description={MetaDesc}
        />
      </Card>
    </div>
  )
};

const mapStateToProps = ({ user }: StoreState): { userInfo: UserInfoProps } => {
  return { userInfo: user.userInfo };
};

export default connect(mapStateToProps)(withRouter(Base));
