import http from '@/utils/http';
import api from '@/api';

// 创建
export function serviceCreateTask(data: object) {
  return http.post(api.task, data, { headers: { successAlert: true } });
}

// 查询
export function serviceGetTask(params?: object) {
  return http.get(api.task, { params, headers: { isLoading: true } });
}

// 删除
export function serviceDeleteTask(id: unknown) {
  return http.delete(`${api.task}/${id}`);
}

// 更新
export function serviceUpdateTask(id: unknown, data?: object) {
  return http.put(`${api.task}/${id}`, data);
}