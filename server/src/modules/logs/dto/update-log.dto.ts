import { PartialType } from '@nestjs/mapped-types'
import { CreateLogDto } from './create-log.dto'
import { IsString, IsNotEmpty } from 'class-validator'

export class UpdateLogDto extends PartialType(CreateLogDto) {
  @IsString()
  @IsNotEmpty()
  id: string
}
