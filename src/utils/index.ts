export * from './helper'
export * from './date'
import { serviceLogout } from '@/services'
import { LOCAL_STORAGE } from '@/constants'
import type { RcFile } from 'antd/es/upload'

export function filterOption(input: string, option: any): boolean {
  if (Array.isArray(option.options)) {
    return option.options.some(
      (item: any) =>
        item.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    )
  } else {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
}

export function sleep(delay?: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// 注销登录
export function logout() {
  serviceLogout()

  const localStorageWhiteList = [LOCAL_STORAGE.LOGIN_NAME]
  Array.from({ length: localStorage.length }, (_, i) => {
    const key = localStorage.key(i)
    return key
  }).forEach((key) => {
    if (key && !localStorageWhiteList.includes(key)) {
      localStorage.removeItem(key)
    }
  })

  sessionStorage.clear()
  location.reload()
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export function base64ToBlob(base64Data: string) {
  let arr = base64Data.split(',') as any,
    fileType = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    l = bstr.length,
    u8Arr = new Uint8Array(l)

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l)
  }
  return new Blob([u8Arr], {
    type: fileType,
  })
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}
