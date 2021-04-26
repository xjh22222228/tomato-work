import http from '@/utils/http'

// 查询所有单位
export function serviceGetAllCompany() {
  return http.get('/company')
}

// 创建单位
export function serviceCreateCompany(data: object) {
  return http.post('/company', data)
}

// 更新单位
export function serviceUpdateCompany(data: object) {
  return http.put('/company', data)
}

// 删除单位
export function serviceDelCompany(id: unknown, data: object) {
  return http.delete(`/company/${id}`, data)
}
