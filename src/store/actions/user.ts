import moment from 'moment'
import { USER } from '../constants'
import { LOCAL_STORAGE } from '@/constants'
import { serviceLoginByToken, serviceLogout } from '@/services'
import { Dispatch } from 'redux'

const { LOGIN } = USER

export function setUser(userInfo: Record<string, any> = {}) {
  if (userInfo.createdAt) {
    userInfo.createdAt = moment(userInfo.createdAt).format('YYYY-MM-DD')
  }
  return {
    type: LOGIN,
    userInfo: userInfo
  }
}

/**
 * Token 登录
 */
export function loginByToken(token: string) {
  return function (dispatch: Dispatch) {
    return serviceLoginByToken(token).then(res => {
      const userInfo = res.userInfo
      return dispatch(setUser(userInfo))
    })
  }
}

/**
 * 注销登录
 */
export function logout() {
  serviceLogout()

  setTimeout(() => {
    const localStorageWhiteList = [LOCAL_STORAGE.LOGIN_NAME]
    const localStorageLen = window.localStorage.length
    const allLocalStorageKey: string[] = []

    for (let i = 0; i < localStorageLen; i++) {
      const key = window.localStorage.key(i) as string
      allLocalStorageKey.push(key)
    }

    allLocalStorageKey.forEach(keyName => {
      if (localStorageWhiteList.indexOf(keyName) === -1) {
        window.localStorage.removeItem(keyName)
      }
    })
    window.sessionStorage.clear()
    window.location.reload()
  })
}
