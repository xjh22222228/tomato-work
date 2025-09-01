import { IsNumber, IsOptional, IsString, Matches } from 'class-validator'
import { dateValidator } from '@/utils/validatorUtils'
import { PaginationDto } from '@/dtos/pagination.dto'

export class GetLogDto extends PaginationDto {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  @IsOptional()
  startDate?: string

  @IsString()
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  @IsOptional()
  endDate?: string

  @IsString()
  @IsOptional()
  companyId?: string

  @IsNumber()
  @IsOptional()
  logType?: number
}
