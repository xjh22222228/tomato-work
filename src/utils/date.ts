import moment from 'moment';

// 判断传入时间戳是否小于今天时间戳
export function isLtTodayTimestamp (current: moment.Moment | null): boolean {
  const todayTimestamp = new Date().setHours(0, 0, 0, 0);
  if (current && current?.valueOf() > todayTimestamp) {
    return false;
  }
  return true;
}
