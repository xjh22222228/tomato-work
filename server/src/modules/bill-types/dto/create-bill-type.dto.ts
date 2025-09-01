import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

export enum BillType {
  INCOME = 1,
  EXPENSE = 2,
}

export class CreateBillTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20, { message: '类型名称不能超过20个字符' })
  name: string

  @IsNotEmpty()
  @IsEnum(BillType, { message: '类型必须是1(收入)或2(支出)' })
  type: number

  @IsOptional()
  @Min(0)
  sortIndex?: number
}
