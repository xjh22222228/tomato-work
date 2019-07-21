import http from '@/utils/http';
import api from '@/api';

// 查询
export function serviceGetPanelData(params?: object) {
  return http.get(api.getPanelData, { params });
}


