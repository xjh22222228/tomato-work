import http from '@/utils/http'

// 创建
export function serviceCreateTodoList(data: object) {
  return http.post('/todoList', data, {
    headers: {
      successAlert: 'true'
    }
  })
}

// 查询
export function serviceGetTodoList(params?: object) {
  return http.get('/todoList', { params })
}

// 删除
export function serviceDeleteTodoList(id: unknown) {
  return http.delete(`/todoList/${id}`, {
    headers: { successAlert: 'true' }
  })
}

// 更新
export function serviceUpdateTodoList(id: unknown, data?: object) {
  return http.put(`/todoList/${id}`, data)
}
