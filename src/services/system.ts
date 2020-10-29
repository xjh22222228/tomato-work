import http from '@/utils/http'
import api from '@/api'

// 获取系统信息
export function serviceGetSystemInfo() {
  return http.get(api.getSystemInfo)
}

