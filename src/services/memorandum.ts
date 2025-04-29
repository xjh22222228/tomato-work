import http from '@/utils/http'

// 新增
export function serviceCreateMemorandum(data: object) {
  return http.post('/memorandum/add', data, {
    headers: { successAlert: 'true' },
  })
}

// 查询所有
export function serviceGetMemorandum(params?: object) {
  return http.post('/memorandum/getAll', {
    ...params,
  })
}

// 通过id查询
export function serviceGetMemorandumById(id: unknown) {
  return http.post(`/memorandum/get`, { id })
}

// 删除
export function serviceDeleteMemorandum(id: unknown) {
  return http.post(`/memorandum/delete`, { id })
}

// 更新
export function serviceUpdateMemorandum(id: unknown, data: object) {
  return http.post(
    `/memorandum/update`,
    { id, ...data },
    {
      headers: { successAlert: 'true' },
    },
  )
}
