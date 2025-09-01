import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class LoginDto {
  @IsOptional()
  @IsString()
  code?: string

  @IsNotEmpty()
  @IsString()
  loginName: string

  @IsNotEmpty()
  @IsString()
  password: string
}
