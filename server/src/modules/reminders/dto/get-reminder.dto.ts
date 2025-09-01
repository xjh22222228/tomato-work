import { IsNumber, IsOptional, IsString, Matches } from 'class-validator'
import { dateValidator } from '@/utils/validatorUtils'
import { PaginationDto } from '@/dtos/pagination.dto'

export class GetReminderDto extends PaginationDto {
  @IsString()
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  @IsOptional()
  startDate?: string

  @IsString()
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  @IsOptional()
  endDate?: string

  @IsNumber()
  @IsOptional()
  type?: number
}
