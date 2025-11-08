import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsOptional,
  IsDate,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLogDto {
  @IsNotEmpty()
  @IsString()
  companyId: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(3)
  logType: number

  @IsString()
  @IsOptional()
  doneContent: string = ''

  @IsString()
  @IsOptional()
  undoneContent: string = ''

  @IsString()
  @IsOptional()
  planContent: string = ''

  @IsOptional()
  @IsString()
  summaryContent: string = ''
}
