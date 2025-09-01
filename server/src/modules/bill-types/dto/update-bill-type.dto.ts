import { PartialType } from '@nestjs/mapped-types'
import { CreateBillTypeDto } from './create-bill-type.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateBillTypeDto extends PartialType(CreateBillTypeDto) {
  @IsNotEmpty()
  @IsString()
  id: string
}
