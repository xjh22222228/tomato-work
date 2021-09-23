import moment from 'moment'

export const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm:ss'
export const FORMAT_DATE_MINUTE = 'YYYY-MM-DD HH:mm'
export const FORMAT_DATE = 'YYYY-MM-DD'
export const DATE_WEEK: any = [
  moment().subtract(7, 'day'),
  moment()
]
export const DATE_YEAR: any = [
  moment().startOf('year'),
  moment().endOf('year')
]

// 判断传入时间是否小于今天时间戳
export function isBefore(current: moment.MomentInput | null): boolean {
  const today = new Date().setHours(0, 0, 0, 0)
  return moment(current).isBefore(today)
}

export function formatDate(date: moment.MomentInput): string {
  return moment(date).format(FORMAT_DATE)
}

export function formatDateTime(date: moment.MomentInput): string {
  return moment(date).format(FORMAT_DATETIME)
}

export function formatDateMinute(date: moment.MomentInput): string {
  return moment(date).format(FORMAT_DATE_MINUTE)
}

export function fromNow(
  startDate: moment.MomentInput,
  endDate: moment.MomentInput
): number {
  const start = moment(startDate).valueOf()
  const end = moment(endDate || Date.now()).valueOf()
  const n = end - start
  return Math.ceil(n / (1000 * 60 * 60 * 24))
}

export function getWeek(date: moment.MomentInput): string {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
  return weeks[moment(date).day()]
}
