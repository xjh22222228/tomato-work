import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator'

export class CreateTodoListDto {
  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  status?: number
}
