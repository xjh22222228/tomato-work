import { PartialType } from '@nestjs/mapped-types'
import { CreateReminderDto } from './create-reminder.dto'
import { IsString } from 'class-validator'

export class UpdateReminderDto extends PartialType(CreateReminderDto) {
  @IsString()
  id: string
}
