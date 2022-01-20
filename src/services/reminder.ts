import http from '@/utils/http'

// 新增
export function serviceCreateReminder(data: object) {
  return http.post('/reminder', data, {
    headers: { successAlert: 'true' }
  })
}

// 查询
export function serviceGetReminder(params?: object) {
  return http.get('/reminder', { params })
}

// 删除
export function serviceDeleteReminder(id: unknown) {
  return http.delete(`/reminder/${id}`, {
    headers: { successAlert: 'true' }
  })
}

// 更新
export function serviceUpdateReminder(id: unknown, data: object) {
  return http.put(`/reminder/${id}`, data, {
    headers: {
      successAlert: 'true',
    }
  })
}
