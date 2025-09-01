import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateBillDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date

  @IsNotEmpty()
  @IsUUID()
  typeId: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsOptional()
  @IsString()
  @MaxLength(250)
  remark?: string

  @IsOptional()
  @IsString()
  imgs?: string
}
