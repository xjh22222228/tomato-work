import axios from 'axios';
import CONFIG from '@/config';
import store from '@/store';
import { message } from 'antd';
import { logout } from '@/store/actions';
import { spin } from '@/utils';

let exiting = false;
const CancelToken = axios.CancelToken;

function handleError(error: any): Promise<any> | undefined {
  if (axios.isCancel(error)) {

  } else {
    const response = error.response;
    message.error(`${response.status} ${response.statusText}`);
  }
  return void 0;
}

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: CONFIG.http.baseURL
});

httpInstance.defaults.headers.common.isLoading = true;
httpInstance.defaults.headers.common.successAlert = false;
httpInstance.defaults.headers.common.errorAlert = true;
Object.setPrototypeOf(httpInstance, axios);

httpInstance.interceptors.request.use(function (config) {
  const method = config.method;
  const url = config.url;
  const userState = store.getState().user.userInfo;

  // 取消重复请求
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
      pathname: window.location.pathname,
      method,
      url,
      cancel
    });
  });

  const data: { [k: string]: any } = {};

  if (config.headers.isLoading) {
    spin.start();
  }

  if (method === 'post' || method === 'put') {
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
    message.warn(res.data.msg ?? '服务器出小差');
  }

  if (res.data.success && res.config.headers.successAlert) {
    message.success(res.data.msg ?? 'success');
  }

  if (res.data.errorCode === 401 && !exiting) {
    exiting = true;
    setTimeout(logout, 2000);
  }
  return res;
}, function (error) {
  return (handleError(error) as any) || Promise.reject(error);
});

export default httpInstance;
