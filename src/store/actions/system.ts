/**
 * @file System Action Creator
 * @since 1.0.0
 * @author xiejiahe <xjh22222228@gmail.com>
 */

import { SYSTEM } from '../constants';
import { serviceGetSystemInfo } from '@/services';
import { Dispatch } from 'redux';

const { INFO } = SYSTEM;

export function setSystemInfo(data: any = {}) {
  return { type: INFO, data };
}

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  return function (dispatch: Dispatch, getState: () => any) {
    const { system: { info } } = getState();

    if (info.nodeVersion) {
      return dispatch(setSystemInfo());
    }

    return serviceGetSystemInfo().then((res: any) => {
      if (res.data.success) {
        const data = res.data.data;
        return dispatch(setSystemInfo(data));
      }
      return dispatch(setSystemInfo());
    });
  };
}
