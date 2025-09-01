import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailScheduleService } from './mail-schedule.service'
import { ConfigModule } from '@nestjs/config'
import { RemindersModule } from '../reminders/reminders.module'

@Module({
  imports: [ConfigModule, RemindersModule],
  providers: [MailService, MailScheduleService],
  exports: [MailService],
})
export class MailModule {}
