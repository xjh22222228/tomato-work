/**
 * @file axios http request config
 * @since 1.0.0
 * @author xiejiahe <mb06@qq.com>
 */

import axios from 'axios';
import CONFIG from '@/config';
import store from '@/store';
import { message } from 'antd';
import { logout } from '@/store/actions';
import { spin } from '@/utils';

let _logout = false;
const CancelToken = axios.CancelToken;

function handleError(error: any): Promise<any> | undefined {
  if (axios.isCancel(error)) {
    
  } else {
    const response = error.response;
    message.error(`${response.status} ${response.statusText}`);
  }
  return;
}

/**
 * Global HTTP Setting
 */
axios.defaults.timeout = 60000;
axios.defaults.headers.common.isLoading = true;
axios.defaults.headers.common.successAlert = false;
axios.defaults.headers.common.errorAlert = true;
axios.defaults.baseURL = CONFIG.http.baseURL;

// http Request instance
const httpInstance = axios.create();
// Merge axios to httpInstance, 
Object.setPrototypeOf(httpInstance, axios);


httpInstance.interceptors.request.use(function (config) {
  const method = config.method;
  const url = config.url;
  const userState = store.getState().user.userInfo;

  /**
   * 取消重复请求，保留最后一次请求
   */
  window.axiosCancelTokenStore.forEach((store, idx) => {
    if (
      config.headers.cancelRequest !== false && 
      store.url === url && 
      store.method === method
    ) {
      store.cancel();
      window.axiosCancelTokenStore.splice(idx, 1);
    }
  });
  
  config.headers.token = userState.token;
  config.cancelToken = new CancelToken(cancel => {
    window.axiosCancelTokenStore.push({
      // 记录当前请求页面，用于取消时判断是否是当前路由
      pathname: window.location.pathname,
      method,
      url,
      cancel
    });
  });

  // 默认需要携带的数据
  const data: any = {};

  // 显示Loading
  if (config.headers.isLoading) {
    spin.start();
  }

  if (method === 'post' || method === 'put') {
    // 处理FormData传输方式
    if (config.data instanceof FormData) {
      for (let key in data) {
        config.data.append(key, data[key])
      }
    } else {
      config.data = Object.assign(data, config.data);
    }
  }

  return config;
}, function (error) {
  return (handleError(error) as any) || Promise.reject(error);
});


httpInstance.interceptors.response.use(function (res) {
  if (res.config.headers.isLoading) {
    spin.done();
  }

  if (!res.data.success && res.config.headers.errorAlert) {
    message.warn(res.data.msg || '服务器出小差');
  }

  if (res.data.success && res.config.headers.successAlert) {
    message.success(res.data.msg || 'success');
  }

  // 登录凭证失效
  if (res.data.errorCode === 401 && !_logout) {
    _logout = true;
    setTimeout(logout, 2000);
  }
  return res;
}, function (error) {
  return (handleError(error) as any) || Promise.reject(error);
});

export default httpInstance;
