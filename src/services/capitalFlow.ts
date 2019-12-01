import http from '@/utils/http';
import api from '@/api';


// 类型
export function serviceGetCapitalFlowType() {
  return http.get(api.capitalFlowType, { headers: { isLoading: true } });
}

export function serviceDeleteCapitalFlowType(id: string) {
  return http.delete(`${api.capitalFlowType}/${id}`, { headers: { successAlert: true } });
}

export function serviceUpdateCapitalFlowType(id: string, data: object) {
  return http.put(`${api.capitalFlowType}/${id}`, data, { headers: { successAlert: true } });
}

export function serviceCreateCapitalFlowType(data: object) {
  return http.post(api.capitalFlowType, data, { headers: { successAlert: true } });
}


// 流动资金

export function serviceGetCapitalFlow(params?: object) {
  return http.get(api.capitalFlow, { params });
}

export function serviceDeleteCapitalFlow(id: string) {
  return http.delete(`${api.capitalFlow}/${id}`, { headers: { successAlert: true } });
}

export function serviceUpdateCapitalFlow(id: string, data: object) {
  return http.put(`${api.capitalFlow}/${id}`, data, { headers: { successAlert: true } });
}

export function serviceCreateCapitalFlow(data: object) {
  return http.post(api.capitalFlow, data);
}

export function serviceGetCapitalFlowPrice(params?: object) {
  return http.get(api.getCapitalFlowPrice, { params });
}