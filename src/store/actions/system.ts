import { SYSTEM } from '../constants'
import { serviceGetSystemInfo } from '@/services'
import { Dispatch } from 'redux'

const { INFO } = SYSTEM

export function setSystemInfo(data: any = {}) {
  return { type: INFO, data }
}

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  return function (dispatch: Dispatch, getState: () => any) {
    const { system: { info } } = getState()

    if (info.nodeVersion) {
      return
    }

    return serviceGetSystemInfo().then(res => {
      return dispatch(setSystemInfo(res))
    })
  }
}
