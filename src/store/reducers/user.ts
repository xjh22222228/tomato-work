// Copyright 2018-2022 the xiejiahe. All rights reserved. MIT license.
import { USER } from '../constants'
import { LOCAL_STORAGE } from '@/constants'
import { isPlainObject } from 'lodash'

const { LOGIN } = USER

export interface UserInfoProps {
  provider: string
  uid: number | undefined
  username: string
  password: string
  loginName: string
  avatarUrl: string
  email: string
  role: string
  token: string | undefined
  bio: string
  location: string
  createdAt: string
}

export interface UserState {
  isLogin: boolean
  isLockScreen: boolean
  userInfo: UserInfoProps
}

let localUser
try {
  const r = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER) as string)
  if (isPlainObject(r)) {
    localUser = r
  }
} catch {}

const initialState: UserState = {
  isLogin: !!localUser,
  isLockScreen: false,
  userInfo: localUser || {
    provider: '', // github ?
    uid: undefined, // 用户ID
    createdAt: '', // 注册时间
    bio: '', // 简介
    username: '', // 昵称
    password: '', // 经过MD5加密后的密码
    loginName: '', // 登录名
    avatarUrl: '', // 头像
    email: '',
    role: '',
    token: undefined, // 登录凭证
    location: ''
  }
}

function user(state = initialState, action: any): UserState {
  switch (action.type) {
    case LOGIN:
      const userInfo = action.userInfo
      if (userInfo?.token) {
        state.isLogin = true
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(userInfo))
        localStorage.setItem(LOCAL_STORAGE.LOGIN_NAME, userInfo.loginName)
      }
      return {
        ...state,
        userInfo: action.userInfo
      }
    default:
      return state
  }
}

export default user
