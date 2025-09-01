import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  uid?: number

  @IsOptional()
  @IsString()
  provider?: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsString()
  ipAddr?: string

  @IsOptional()
  @IsString()
  token?: string
}
