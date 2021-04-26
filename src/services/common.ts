import http from '@/utils/http'

// 获取后台首页面板数据
export function serviceGetPanelData(params?: object) {
  return http.get('/panel', { params })
}


