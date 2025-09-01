import { IsString, Matches, IsOptional, IsNumber } from 'class-validator'
import { dateValidator } from '@/utils/validatorUtils'
import { PaginationDto } from '@/dtos/pagination.dto'

export class GetBillDto extends PaginationDto {
  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  @IsString()
  @IsOptional()
  startDate?: string

  @Matches(dateValidator.REGEXP, { message: dateValidator.MESSAGE })
  @IsString()
  @IsOptional()
  endDate?: string

  @IsString()
  @IsOptional()
  typeId?: string

  @IsNumber()
  @IsOptional()
  type?: number

  @IsString()
  @IsOptional()
  keyword?: string

  @IsString()
  @IsOptional()
  sort?: string
}
