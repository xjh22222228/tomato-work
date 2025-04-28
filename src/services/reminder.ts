import http from '@/utils/http'

// 新增
export function serviceCreateReminder(data: object) {
  return http.post('/reminder/add', data, {
    headers: { successAlert: 'true' },
  })
}

// 查询
export function serviceGetReminder(params?: object) {
  return http.post('/reminder/getAll', { ...params })
}

// 删除
export function serviceDeleteReminder(id: unknown) {
  return http.post(
    `/reminder/delete`,
    { id },
    {
      headers: { successAlert: 'true' },
    }
  )
}

// 更新
export function serviceUpdateReminder(id: unknown, data: object) {
  return http.post(
    `/reminder/update`,
    { id, ...data },
    {
      headers: {
        successAlert: 'true',
      },
    }
  )
}
