import http from '@/utils/http'

// 获取系统信息
export function serviceGetSystemInfo() {
  return http.get('/system/info')
}
