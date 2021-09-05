
// 日报
const LOG_DAILY = '1'
// 周报
const LOG_WEEK = '2'
// 月报
const LOG_MONTH = '3'

export const LOG_LIST = [
  {
    key: LOG_DAILY,
    name: '日报',
    doneTitle: '今日完成工作',
    undoneTitle: '今日未完成工作',
    planTitle: '明天工作计划',
    summaryTitle: '工作总结'
  },
  {
    key: LOG_WEEK,
    name: '周报',
    doneTitle: '本周完成工作',
    undoneTitle: '本周未完成工作',
    planTitle: '下周工作计划',
    summaryTitle: '工作总结'
  },
  {
    key: LOG_MONTH,
    name: '月报',
    doneTitle: '本月完成工作',
    undoneTitle: '本月未完成工作',
    planTitle: '下月工作计划',
    summaryTitle: '工作总结'
  }
]
