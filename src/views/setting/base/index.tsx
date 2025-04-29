/**
 * 个人中心
 */
import React from 'react'
import './style.scss'
import Avatar from '@/components/avatar'
import userPoster from '@/assets/img/common/user-poster.png'
import { Card, Divider } from 'antd'
import { useAppSelector } from '@/hooks'

const { Meta } = Card

const BasePage: React.FC = function () {
  const userInfo = useAppSelector((state) => state.user.userInfo)

  const MetaDesc = (
    <div className="meta-desc">
      <div className="loginname">{userInfo.loginName}</div>
      <div>UID：{userInfo.uid}</div>
      <div>简介：{userInfo.bio}</div>
      <div>邮箱：{userInfo.email}</div>
      <div>地区：{userInfo.location}</div>
      <div>注册时间：{userInfo.createdAt}</div>
    </div>
  )

  return (
    <div className="setting-base">
      <Divider orientation="left" plain>
        个人中心
      </Divider>
      <Card
        style={{ width: 370 }}
        cover={<img alt="" src={userPoster} className="poster" />}
      >
        <Meta
          avatar={<Avatar src={userInfo.avatarUrl} size="large" />}
          title={userInfo.username}
          description={MetaDesc}
        />
      </Card>
    </div>
  )
}

export default BasePage
