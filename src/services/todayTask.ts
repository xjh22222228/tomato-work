import http from '@/utils/http';
import api from '@/api';

// 创建
export function serviceCreateTask(data: object) {
  return http.post(api.todayTask, data, { headers: { successAlert: true } });
}

// 查询
export function serviceGetTask(params?: object) {
  return http.get(api.todayTask, { params, headers: { isLoading: true } });
}

// 删除
export function serviceDeleteTask(id: unknown) {
  return http.delete(`${api.todayTask}/${id}`);
}

// 更新
export function serviceUpdateTask(id: unknown, data?: object) {
  return http.put(`${api.todayTask}/${id}`, data);
}