/**
 * @file User Action Creator
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

import { USER } from '../constants';
import config from '@/config';
import { LOCAL_STORAGE } from '@/constants';
import { serviceLoginByToken, serviceLogout } from '@/services';
import _ from 'lodash';
import { Dispatch } from 'redux';
import moment from 'moment';

const { LOGIN } = USER;

export function setUser(userInfo: any = {}) {
  if (userInfo.createdAt) {
    userInfo.createdAt = moment(userInfo.createdAt).format('YYYY-MM-DD');
  }
  return {
    type: LOGIN,
    userInfo: userInfo
  };
}

/**
 * 使用token进行登录
 */
export function loginByToken(token: string) {
  return function (dispatch: Dispatch) {
    return serviceLoginByToken(token).then((res: any) => {
      if (res.data.success) {
        const userInfo = res.data.data.userInfo;
        return dispatch(setUser(userInfo));
      }
      return dispatch(setUser());
    });
  }
}

/**
 * 注销登录
 */
export function logout() {
  serviceLogout()
  .finally(() => {
    const localStorageWhiteList = [LOCAL_STORAGE.LOGIN_NAME];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i) as string;
      if (localStorageWhiteList.indexOf(key) === -1) {
        window.localStorage.removeItem(key);
      }
    }
    window.sessionStorage.clear();
    window.location.reload();
  });
}

/**
 * Github Auth
 */
export function githubAuthz() {
  const url = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${config.github.callbackURL}`;
  window.location.replace(url);
}

/**
 * 验证本地登录状态
 */
export function validateLocalStatus() {
  let userInfo = {};
  try {
    userInfo = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.USER) as string);
    if (!_.isPlainObject(userInfo)) {
      userInfo = {};
    }
  } catch (e) {}
  return setUser(userInfo);
}
