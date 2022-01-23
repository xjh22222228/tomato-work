// Copyright 2018-2022 the xiejiahe. All rights reserved. MIT license.
import { SYSTEM } from '../constants'
import { serviceGetSystemInfo } from '@/services'
import type { Dispatch } from 'redux'

const { INFO } = SYSTEM

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
      return dispatch({ type: INFO, data: res })
    })
  }
}
