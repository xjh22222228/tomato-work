import { IsNumber, IsOptional } from 'class-validator'
import { PAGE_SIZE, PAGE_NO } from '@/constants/pagination'

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  pageNo?: number = PAGE_NO

  @IsNumber()
  @IsOptional()
  pageSize?: number = PAGE_SIZE
}
