import http from '@/utils/http'
import { formatDate } from '@/utils'

// 查询所有单位
export async function serviceGetAllCompany() {
  const res = await http.get('/company')
  res.data.data.rows = res.data.data.rows.map((item: any) => {
    item.startDate = formatDate(item.startDate)
    if (item.endDate) {
      item.endDate = formatDate(item.endDate)
    }
    return item
  })
  return res
}

// 创建单位
export function serviceCreateCompany(data: object) {
  return http.post('/company', data, {
    headers: { successAlert: true }
  })
}

// 更新单位
export function serviceUpdateCompany(id: string, data: object) {
  return http.put(`/company/${id}`, data, {
    headers: { successAlert: true }
  })
}

// 删除单位
export function serviceDelCompany(id: unknown) {
  return http.delete(`/company/${id}`, {
    headers: { successAlert: true }
  })
}
