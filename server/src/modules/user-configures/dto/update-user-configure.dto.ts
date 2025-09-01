import { PartialType } from '@nestjs/mapped-types'
import { CreateUserConfigureDto } from './create-user-configure.dto'

export class UpdateUserConfigureDto extends PartialType(
  CreateUserConfigureDto,
) {}
