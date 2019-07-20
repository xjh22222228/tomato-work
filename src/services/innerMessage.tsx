import http from '@/utils/http';
import api from '@/api';

// 查询
export function serviceGetInnerMessage(params?: object) {
  return http.get(api.innerMessage, { params, headers: { errorAlert: false, cancelRequest: false } });
}

// 标志已读
export function serviceUpdateInnerMessageHasRead(id: unknown) {
  return http.put(`${api.innerMessage}/${id}`, null, { headers: { successAlert: true } });
}
