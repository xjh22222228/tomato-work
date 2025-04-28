import http from '@/utils/http'

// 创建
export function serviceCreateTask(data: object) {
  return http.post('/task/add', data, {
    headers: { successAlert: 'true' },
  })
}

// 查询
export function serviceGetTask(params?: object) {
  return http.post('/task/getAll', { ...params })
}

// 删除
export function serviceDeleteTask(id: unknown) {
  return http.post(`/task/delete`, { id })
}

// 更新
export function serviceUpdateTask(id: unknown, data?: object) {
  return http.post(`/task/update`, { id, ...data })
}
