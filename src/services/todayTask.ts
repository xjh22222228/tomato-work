import http from '@/utils/http'

// 创建
export function serviceCreateTask(data: object) {
  return http.post('/task', data, {
    headers: { successAlert: 'true' }
  })
}

// 查询
export function serviceGetTask(params?: object) {
  return http.get('/task', { params })
}

// 删除
export function serviceDeleteTask(id: unknown) {
  return http.delete(`/task/${id}`)
}

// 更新
export function serviceUpdateTask(id: unknown, data?: object) {
  return http.put(`/task/${id}`, data)
}
