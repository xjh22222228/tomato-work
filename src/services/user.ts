import http from '@/utils/http'

// 通过账号密码登录
export function serviceLogin(data: object) {
  return http.post('/passport/local', data)
}

// 通过token登录
export function serviceLoginByToken(token: string) {
  return http.get('/accessToken', {
    params: { token }
  })
}

// 退出登录
export function serviceLogout() {
  return http.get('/logout')
}

// 更新用户信息
export function serviceUpdateUser(data: object) {
  return http.post('/user/update', data, {
    headers: { successAlert: 'true' }
  })
}

// 获取用户配置信息
export function serviceGetUserConfig() {
  return http.get('/userConfig')
}

// 更新用户配置信息
export function serviceUpdateUserConfig(data: object) {
  return http.put('/userConfig', data, {
    headers: { successAlert: 'true' }
  })
}
