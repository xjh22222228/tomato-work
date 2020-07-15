import http from '@/utils/http';
import api from '@/api';

// 创建
export function serviceCreateTodoList(data: object) {
  return http.post(api.todoList, data);
}

// 查询
export function serviceGetTodoList(params?: object) {
  return http.get(api.todoList, { params });
}

// 删除
export function serviceDeleteTodoList(id: unknown) {
  return http.delete(`${api.todoList}/${id}`, {
    headers: { successAlert: true }
  });
}

// 更新
export function serviceUpdateTodoList(id: unknown, data?: object) {
  return http.put(`${api.todoList}/${id}`, data);
}
