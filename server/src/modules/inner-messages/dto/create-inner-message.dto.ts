import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateInnerMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @IsNumber()
  type?: number

  @IsOptional()
  @IsBoolean()
  hasRead?: boolean
}
