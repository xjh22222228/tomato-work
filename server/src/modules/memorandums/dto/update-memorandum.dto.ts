import { PartialType } from '@nestjs/mapped-types'
import { CreateMemorandumDto } from './create-memorandum.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateMemorandumDto extends PartialType(CreateMemorandumDto) {
  @IsString()
  @IsNotEmpty()
  id: string
}
