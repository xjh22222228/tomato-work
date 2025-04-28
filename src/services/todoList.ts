import http from '@/utils/http'

// 创建
export function serviceCreateTodoList(data: object) {
  return http.post('/todo-list/add', data, {
    headers: {
      successAlert: 'true',
    },
  })
}

// 查询
export function serviceGetTodoList(params?: object) {
  return http.post('/todo-list/getAll', { ...params })
}

// 删除
export function serviceDeleteTodoList(id: unknown) {
  return http.post(
    `/todo-list/delete`,
    { id },
    {
      headers: { successAlert: 'true' },
    }
  )
}

// 更新
export function serviceUpdateTodoList(id: unknown, data?: object) {
  return http.post(`/todo-list/update`, { id, ...data })
}
