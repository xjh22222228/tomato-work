import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string

  @IsNotEmpty()
  @IsDateString()
  startDate: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsNotEmpty()
  @IsString()
  remark: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsOptional()
  @IsDateString()
  expectLeaveDate?: string
}
