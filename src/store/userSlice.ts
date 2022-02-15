// Copyright 2018-present the xiejiahe. All rights reserved. MIT license.
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_STORAGE } from '@/constants'
import { isPlainObject } from 'lodash'
import { serviceLoginByToken } from '@/services'
import type { AppDispatch } from '.'
import { formatDate } from '@/utils'

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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER_INFO: (state, action: PayloadAction<UserInfoProps>) => {
      const userInfo = action.payload
      userInfo.createdAt &&= formatDate(userInfo.createdAt)
      if (userInfo.token) {
        state.isLogin = true
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(userInfo))
        localStorage.setItem(LOCAL_STORAGE.LOGIN_NAME, userInfo.loginName)
      }
      state.userInfo = userInfo
    }
  }
})

export const { SET_USER_INFO } = userSlice.actions

export const loginByToken = (token: string) => (dispatch: AppDispatch) => {
  return serviceLoginByToken(token).then(res => {
    const userInfo = res.userInfo
    return dispatch(SET_USER_INFO(userInfo))
  })
}

export default userSlice.reducer
