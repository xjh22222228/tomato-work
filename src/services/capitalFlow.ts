import http from '@/utils/http'

// 类型
export function serviceGetCapitalFlowType() {
  return http.get('/capitalFlowType')
}

export function serviceDeleteCapitalFlowType(id: string) {
  return http.delete(`/capitalFlowType/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateCapitalFlowType(id: string, data: object) {
  return http.put(`/capitalFlowType/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceCreateCapitalFlowType(data: object) {
  return http.post('/capitalFlowType', data, {
    headers: { successAlert: 'true' }
  })
}


// 资金流动
export function serviceGetCapitalFlow(params?: object) {
  return http.get('/capitalFlow', { params })
}

export function serviceDeleteCapitalFlow(id: string) {
  return http.delete(`/capitalFlow/${id}`, {
    headers: { successAlert: 'true' }
  })
}

export function serviceUpdateCapitalFlow(id: string, data: object) {
  return http.put(`/capitalFlow/${id}`, data, {
    headers: { successAlert: 'true' }
  })
}

export function serviceCreateCapitalFlow(data: object) {
  return http.post('/capitalFlow', data)
}

export function serviceGetCapitalFlowAmount(params?: object) {
  return http.get('/capitalFlow/amount/statistics', { params })
}

export function serviceGetCapitalFlowAmountGroup(params: object) {
  return http.get('/capitalFlow/amount/group', { params })
}

export function serviceGetAmountById(id: string) {
  return http.get(`/capitalFlow/${id}`)
}
