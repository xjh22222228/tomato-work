import http from '@/utils/http'

// 通过账号密码登录
export function serviceLogin(data: object) {
  return http.post('/passport/login', data)
}

// 通过token登录
export function serviceLoginByToken(token: string) {
  return http.post('/passport/token', {
    token,
  })
}

export function serviceLoginByCode(code: string) {
  return http.post('/passport/code', {
    code,
  })
}

// 退出登录
export function serviceLogout() {
  // return http.get('/logout')
}

// 更新用户信息
export function serviceUpdateUser(data: object) {
  return http.post('/user/update', data, {
    headers: { successAlert: 'true' },
  })
}

// 获取用户配置信息
export function serviceGetUserConfig() {
  return http.post('/user-configure/get')
}

// 更新用户配置信息
export function serviceUpdateUserConfig(data: object) {
  return http.post('/user-configure/update', data, {
    headers: { successAlert: 'true' },
  })
}
