import moment from 'moment';

type ns = number | string;

export const ONE_DAY_TIMESTAMP = 60 * 60 * 24 * 1000 - 1;

// 获取当前月份总天数
export function getCurMonthTotalDay(): number {
  return moment().daysInMonth();
}

// 获取当前月份的第一天日期
export function getCurMonthFirstDay(format: 'timestamp'): number;
export function getCurMonthFirstDay(format: string): string;
export function getCurMonthFirstDay(format: string = 'timestamp'): ns {
  const cur = new Date();
  cur.setDate(1);
  cur.setHours(0, 0, 0);
  return format === 'timestamp' ? cur.getTime() : moment(cur).format(format);
}

// 获取当前月份的最后一天日期
export function getCurMonthLastDay(format: 'timestamp'): number;
export function getCurMonthLastDay(format: string): string;
export function getCurMonthLastDay(format: string = 'timestamp'): ns {
  const cur = new Date();
  cur.setDate(getCurMonthTotalDay());
  cur.setHours(23, 59, 59);
  return format === 'timestamp' ? cur.getTime() : moment(cur).format(format);
}

// 判断传入时间戳是否小于今天时间戳
export function isLtTodayTimestamp (current: moment.Moment | undefined): boolean {
  const todayTimestamp = new Date().setHours(0, 0, 0, 0);
  if (current && current.valueOf() > todayTimestamp) {
    return false;
  }
  return true;
}

// 获取今天日期开始时间戳， 如：2019-07-05 00:00:00
export function getTodayStartTimestamp() {
  return new Date().setHours(0, 0, 0, 0);
}

// 获取今天日期开始时间戳， 如：2019-07-05 23:59:59
export function getTodayEndTimestamp() {
  return new Date().setHours(23, 59, 59);
}

// 根据日期获取开始时间戳
export function getStartTimestampByDate(date?: any) {
  return new Date(date).setHours(0, 0, 0, 0) || getTodayStartTimestamp();
}

// 根据日期获取结束时间戳
export function getEndTimestampByDate(date?: any) {
  return new Date(date).setHours(23, 59, 59) || getTodayEndTimestamp();
}

// 获取今天日期开始时间戳和结束时间戳
export function getTodayStartAndEndTimestamp(): [number, number] {
  return [getTodayStartTimestamp(), getTodayEndTimestamp()];
}

// 判断是否是今天
export function isToday(date: any) {
  try {
    const parse = +new Date(date);
    if (getTodayStartTimestamp() < parse && getTodayEndTimestamp() > parse) {
      return true;
    }
  } catch (err) {
    return false;
  }
}

// 获取今年第一天
export function getThisYearFirstDay() {
  const now = new Date();
  now.setMonth(0, 1);
  now.setHours(0, 0, 0, 0);

  return moment(now.getTime());
}
