import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator'

export class CreateLogDto {
  @IsNotEmpty()
  @IsString()
  companyId: string

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
