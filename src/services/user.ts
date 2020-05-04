import http from '@/utils/http';
import api from '@/api';

// 通过账号密码登录
export function serviceLogin(data: object) {
  return http.post(api.login, data);
}

// 通过token登录
export function serviceLoginByToken(token: string) {
  return http.get(api.loginByToken, {
    params: { token }
  });
}

// 退出登录
export function serviceLogout() {
  return http.get(api.logout);
}

// 更新用户信息
export function serviceUpdateUser(data: object) {
  return http.post(api.updateUser, data, {
    headers: { successAlert: true }
  });
}

// 获取用户配置信息
export function serviceGetUserConfig() {
  return http.get(api.getUserConfig);
}

// 更新用户配置信息
export function serviceUpdateUserConfig(data: object) {
  return http.put(api.getUserConfig, data, {
    headers: { successAlert: true }
  });
}
