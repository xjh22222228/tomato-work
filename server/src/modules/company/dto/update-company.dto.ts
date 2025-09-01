import { PartialType } from '@nestjs/mapped-types'
import { CreateCompanyDto } from './create-company.dto'
import { IsString, IsNotEmpty } from 'class-validator'

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsString()
  @IsNotEmpty()
  id: string
}
