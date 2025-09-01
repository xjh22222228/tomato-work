import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateUserConfigureDto {
  @IsOptional()
  @IsBoolean()
  isTaskNotify?: boolean

  @IsOptional()
  @IsBoolean()
  isMatterNotify?: boolean

  @IsOptional()
  @IsString()
  serverChanSckey?: string
}
