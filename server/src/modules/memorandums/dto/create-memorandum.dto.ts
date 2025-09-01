import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateMemorandumDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  markdown?: string

  @IsOptional()
  @IsNumber()
  sortIndex?: number
}
