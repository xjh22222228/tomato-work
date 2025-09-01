import { IsString, Matches } from 'class-validator'
import { dateValidator } from '@/utils/validatorUtils'

export class GetTaskDto {
  @IsString()
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  startDate: string

  @IsString()
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  endDate: string
}
