import moment from 'moment'

// 判断传入时间是否小于今天时间戳
export function isBefore(current: moment.MomentInput | null): boolean {
  const today = new Date().setHours(0, 0, 0, 0)
  return moment(current).isBefore(today)
}

export function formatDate(date: moment.MomentInput): string {
  return moment(date).format('YYYY-MM-DD')
}

export function formatDateTime(date: moment.MomentInput): string {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export function fromNow(
  startDate: moment.MomentInput,
  endDate: moment.MomentInput
): number {
  const start = moment(startDate).valueOf()
  const end = moment(endDate || Date.now()).valueOf()
  const n = end - start
  return Math.trunc(n / (1000 * 60 * 60 * 24))
}
