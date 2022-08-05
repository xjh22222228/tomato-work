export * from './helper'
export * from './date'
import { serviceLogout } from '@/services'
import { LOCAL_STORAGE } from '@/constants'

export function filterOption(input: string, option: any): boolean {
  if (Array.isArray(option.options)) {
    return option.options
      .some((item: any) => item.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  } else {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
}

export function sleep(delay?: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

// 注销登录
export function logout() {
  serviceLogout()

  setTimeout(() => {
    const localStorageWhiteList = [LOCAL_STORAGE.LOGIN_NAME]
    const localStorageLen = localStorage.length
    const allLocalStorageKey: string[] = []

    for (let i = 0; i < localStorageLen; i++) {
      const key = localStorage.key(i) as string
      allLocalStorageKey.push(key)
    }

    allLocalStorageKey.forEach(keyName => {
      if (localStorageWhiteList.indexOf(keyName) === -1) {
        localStorage.removeItem(keyName)
      }
    })
    sessionStorage.clear()
    location.reload()
  })
}
