import http from '@/utils/http'

// 查询
export function serviceGetInnerMessage(params?: object) {
  return http.get('/innerMessage', {
    params,
    headers: {
      errorAlert: 'false',
      cancelRequest: 'false'
    }
  })
}

// 标志已读
export function serviceUpdateInnerMessageHasRead(id: unknown) {
  return http.put(`/innerMessage/${id}`, null, {
    headers: { successAlert: 'true' }
  })
}
