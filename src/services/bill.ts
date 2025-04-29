import http from '@/utils/http'

// 类型
export function serviceGetBillType() {
  return http.post('/bill-type/getAll')
}

export function serviceDeleteBillType(ids: string[]) {
  return http.post(
    `/bill-type/delete`,
    { ids },
    {
      headers: { successAlert: 'true' },
    },
  )
}

export function serviceUpdateBillType(id: string, data: object) {
  return http.post(
    `/bill-type/update`,
    { id, ...data },
    {
      headers: { successAlert: 'true' },
    },
  )
}

export function serviceCreateBillType(data: object) {
  return http.post('/bill-type/add', data, {
    headers: { successAlert: 'true' },
  })
}

// 资金流动
export function serviceGetBill(data?: object) {
  return http.post('/bill/getAll', data)
}

export function serviceDeleteBill(id: string) {
  return http.post(
    `/bill/delete`,
    { id },
    {
      headers: { successAlert: 'true' },
    },
  )
}

export function serviceUpdateBill(id: string, data: object) {
  return http.post(
    `/bill/update`,
    { id, ...data },
    {
      headers: { successAlert: 'true' },
    },
  )
}

export function serviceCreateBill(data: object) {
  return http.post('/bill/add', data)
}

export function serviceGetBillAmount(params?: object) {
  return http.post('/bill/amount/statistics', { ...params })
}

export function serviceGetBillAmountGroup(params: object) {
  return http.post('/bill/amount/group', { ...params })
}

export function serviceGetAmountById(id: string) {
  return http.post(`/bill/get`, { id })
}
