/**
 * @file User Action Creator
 * @since 1.0.0
 * @author xiejiahe <xjh22222228@gmail.com>
 */
import config from '@/config';
import _ from 'lodash';
import moment from 'moment';
import { USER } from '../constants';
import { LOCAL_STORAGE } from '@/constants';
import { serviceLoginByToken, serviceLogout } from '@/services';
import { Dispatch } from 'redux';

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
    const localStorageLen = window.localStorage.length;
    const allLocalStorageKey: string[] = [];

    for (let i = 0; i < localStorageLen; i++) {
      const key = window.localStorage.key(i) as string;
      allLocalStorageKey.push(key);
    }

    allLocalStorageKey.forEach(keyName => {
      if (localStorageWhiteList.indexOf(keyName) === -1) {
        window.localStorage.removeItem(keyName);
      }
    });
    window.sessionStorage.clear();
    window.location.reload(true);
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
  } catch {}
  return setUser(userInfo);
}
