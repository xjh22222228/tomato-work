import * as cronParser from 'cron-parser'

/**
 * 验证 cron 表达式是否有效
 * @param cronExpression cron 表达式
 * @returns boolean
 */
export function isValidCronExpression(cronExpression: string): boolean {
  if (!cronExpression) return false
  try {
    cronParser.CronExpressionParser.parse(cronExpression)
    return true
  } catch {
    return false
  }
}

/**
 * 检查 cron 表达式是否满足当前时间
 * @param cronExpression cron 表达式
 * @returns boolean
 */
export function isCronExpressionMatch(cronExpression: string): boolean {
  if (!isValidCronExpression(cronExpression)) {
    return false
  }

  try {
    const interval = cronParser.CronExpressionParser.parse(cronExpression)
    const nextDate = interval.next()
    return nextDate.getTime() <= Date.now()
  } catch {
    return false
  }
}

export function getNextCronExecution(cronExpression: string): number | null {
  try {
    const interval = cronParser.CronExpressionParser.parse(cronExpression)
    const nextDate = interval.next()
    return nextDate.getTime()
  } catch {
    return null
  }
}
