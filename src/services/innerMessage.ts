import http from '@/utils/http'

// 查询
export function serviceGetInnerMessage(params?: object) {
  return http.post(
    '/inner-messages/get',
    {
      ...params,
    },
    {
      headers: {
        errorAlert: 'false',
      },
    }
  )
}

// 标志已读
export function serviceUpdateInnerMessageHasRead(id: unknown) {
  return http.put(`/inner-messages/${id}`, null, {
    headers: { successAlert: 'true' },
  })
}
