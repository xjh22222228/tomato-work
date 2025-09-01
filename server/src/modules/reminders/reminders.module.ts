import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RemindersService } from './reminders.service'
import { RemindersController } from './reminders.controller'
import { Reminder } from './entities/reminder.entity'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, User])],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
