import http from '@/utils/http';
import api from '@/api';

// 获取后台首页面板数据
export function serviceGetPanelData(params?: object) {
  return http.get(api.getPanelData, { params });
}


