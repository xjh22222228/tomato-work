import http from '@/utils/http'
import { formatDate, fromNow } from '@/utils'

// 查询所有单位
export async function serviceGetAllCompany() {
  const res = await http.get('/company')
  res.rows = res.rows.map((item: any) => {
    item.startDate = formatDate(item.startDate)
    item.__amount__ = `￥${item.amount}`
    item.__jobDay__ = fromNow(item.startDate, item.endDate) + ' 天'
    if (item.endDate) {
      item.endDate = formatDate(item.endDate)
    }
    if (item.expectLeaveDate) {
      item.expectLeaveDate = formatDate(item.expectLeaveDate)
    }
    item.__endDate__ = item.endDate ?? '至今'
    return item
  })
  return res
}

// 创建单位
export function serviceCreateCompany(data: object) {
  return http.post('/company', data, {
    headers: { successAlert: 'true' }
  })
}

// 更新单位
export function serviceUpdateCompany(id: string, data: object) {
  return http.put(`/company/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}

// 删除单位
export function serviceDelCompany(id: unknown) {
  return http.delete(`/company/${id}`, {
    headers: { successAlert: 'true' }
  })
}
