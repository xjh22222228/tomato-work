import http from '@/utils/http'
import { formatDate, getWeek } from '@/utils'
import { LOG_LIST } from '@/views/log/constants'

// 创建日志
export function serviceCreateLog(data: object) {
  return http.post('/log/add', data, {
    headers: { successAlert: 'true' },
  })
}

// 更新日志
export function serviceUpdateLog(data: Record<string, any>) {
  return http.post(`/log/update`, data, {
    headers: { successAlert: 'true' },
  })
}

// 查询日志列表
export async function serviceGetLogList(params?: object) {
  const res = await http.post('/log/getAll', { ...params })
  res.rows = res.rows.map((item: Record<string, any>) => {
    item.__createdAt__ = `${formatDate(item.createdAt)} ${getWeek(
      item.createdAt
    )}`
    const lType = LOG_LIST.find((el) => Number(el.key) === Number(item.logType))
    item.__logType__ = lType?.name
    item.companyName ||= '无'
    return item
  })
  return res
}

// 删除日志
export function serviceDeleteLog(id: string) {
  return http.post(
    `/log/delete`,
    { id },
    {
      headers: { successAlert: 'true' },
    }
  )
}

// 查询日志
export function serviceGetLogById(id: string) {
  return http.post(`/log/get`, { id })
}
