import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator'

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsNumber()
  date: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  type?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  count?: number
}
