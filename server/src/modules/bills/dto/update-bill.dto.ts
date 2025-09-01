import { PartialType } from '@nestjs/mapped-types'
import { CreateBillDto } from './create-bill.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @IsNotEmpty()
  @IsString()
  id: string
}
