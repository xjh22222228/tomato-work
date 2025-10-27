import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'
import { Transform } from 'class-transformer'
import * as dayjs from 'dayjs'
import { isValidCronExpression, getNextCronExecution } from '@/utils/cronUtils'

@ValidatorConstraint({ name: 'isValidCron', async: false })
export class IsValidCronConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isValidCronExpression(value)
  }

  defaultMessage() {
    return '请输入有效的 cron 表达式，例如：0 9 * * *（每天早上9点）'
  }
}

// 创建装饰器
export function IsValidCron() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCron',
      target: object.constructor,
      propertyName: propertyName,
      validator: IsValidCronConstraint,
    })
  }
}

export class CreateReminderDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @Transform(({ value, obj }) => {
    // 如果设置了 cron, 将 cron 的值更新到 date 中
    if (obj.cron && isValidCronExpression(obj.cron)) {
      value = getNextCronExecution(obj.cron)
    }

    if (typeof value === 'number') return value
    const now = Date.now()
    try {
      return dayjs(value).valueOf() || now
    } catch {
      return now
    }
  })
  date?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  type?: number = 1

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.cron !== undefined && o.cron !== '')
  @IsValidCron()
  cron?: string

  @IsOptional()
  @IsBoolean()
  open?: boolean
}
