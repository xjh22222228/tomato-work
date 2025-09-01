import { PartialType } from '@nestjs/mapped-types'
import { CreateInnerMessageDto } from './create-inner-message.dto'

export class UpdateInnerMessageDto extends PartialType(CreateInnerMessageDto) {}
