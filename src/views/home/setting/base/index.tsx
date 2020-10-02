/**
 * 个人中心
 */
import React from 'react';
import './style.scss';
import Avatar from '@/components/avatar';
import { Card, Divider } from 'antd';
import { connect } from 'react-redux';
import { StoreState } from '@/store';
import { UserInfoProps } from '@/store/reducers/user';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const { Meta } = Card;

type Props = {
  userInfo: UserInfoProps;
}

const Base: React.FC<Props & RouteComponentProps> = function ({ userInfo }) {

  const MetaDesc = (
    <div className="meta-desc">
      <div className="loginname">{userInfo.loginName}</div>
      <div>UID：{userInfo.uid}</div>
      <div>简介：{userInfo.bio}</div>
      <div>邮箱：{userInfo.email}</div>
      <div>地区：{userInfo.location}</div>
      <div>注册时间：{userInfo.createdAt}</div>
    </div>
  );

  return (
    <div className="setting-base">
      <Divider orientation="left" plain>个人中心</Divider>
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
  );
};

const mapStateToProps = ({ user }: StoreState): { userInfo: UserInfoProps } => {
  return { userInfo: user.userInfo };
};

export default connect(mapStateToProps)(withRouter(Base));
