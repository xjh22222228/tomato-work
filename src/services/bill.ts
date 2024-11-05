import http from '@/utils/http'

// 类型
export function serviceGetBillType() {
  return http.get('/billType')
}

export function serviceDeleteBillType(id: string) {
  return http.delete(`/billType/${id}`, {
    headers: { successAlert: 'true' },
  })
}

export function serviceUpdateBillType(id: string, data: object) {
  return http.put(`/billType/${id}`, data, {
    headers: { successAlert: 'true' },
  })
}

export function serviceCreateBillType(data: object) {
  return http.post('/billType', data, {
    headers: { successAlert: 'true' },
  })
}

// 资金流动
export function serviceGetBill(data?: object) {
  return http.post('/bill/get', data)
}

export function serviceDeleteBill(id: string) {
  return http.delete(`/bill/${id}`, {
    headers: { successAlert: 'true' },
  })
}

export function serviceUpdateBill(id: string, data: object) {
  return http.put(`/bill/${id}`, data, {
    headers: { successAlert: 'true' },
  })
}

export function serviceCreateBill(data: object) {
  return http.post('/bill', data)
}

export function serviceGetBillAmount(params?: object) {
  return http.get('/bill/amount/statistics', { params })
}

export function serviceGetBillAmountGroup(params: object) {
  return http.get('/bill/amount/group', { params })
}

export function serviceGetAmountById(id: string) {
  return http.get(`/bill/${id}`)
}
