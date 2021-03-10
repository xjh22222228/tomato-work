import moment from 'moment'

// 判断传入时间是否小于今天时间戳
export function isBefore(current: moment.Moment | null): boolean {
  const today = new Date().setHours(0, 0, 0, 0)
  return moment(current).isBefore(today)
}
