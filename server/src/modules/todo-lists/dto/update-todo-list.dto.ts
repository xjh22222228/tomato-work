import { PartialType } from '@nestjs/mapped-types'
import { CreateTodoListDto } from './create-todo-list.dto'
import { IsString } from 'class-validator'

export class UpdateTodoListDto extends PartialType(CreateTodoListDto) {
  @IsString()
  id: string
}
