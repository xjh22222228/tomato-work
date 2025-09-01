import { PartialType } from '@nestjs/mapped-types'
import { CreateTaskDto } from './create-task.dto'
import { IsString } from 'class-validator'

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  id: string
}
