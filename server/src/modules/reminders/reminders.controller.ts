import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { RemindersService } from './reminders.service'
import { CreateReminderDto } from './dto/create-reminder.dto'
import { UpdateReminderDto } from './dto/update-reminder.dto'
import { User } from '@/decorators/user.decorator'
import { GetReminderDto } from './dto/get-reminder.dto'

@Controller('reminder')
@UseGuards(UserAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('add')
  create(@User() user, @Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(user.uid, createReminderDto)
  }

  @Post('getAll')
  findAll(@User() user, @Body() getReminderDto: GetReminderDto) {
    return this.remindersService.findAll(user.uid, getReminderDto)
  }

  @Post('get')
  findOne(@User() user, @Body('id') id: string) {
    return this.remindersService.findOne(id, user.uid)
  }

  @Post('update')
  update(@User() user, @Body() updateReminderDto: UpdateReminderDto) {
    return this.remindersService.update(user.uid, updateReminderDto)
  }

  @Post('delete')
  remove(@User() user, @Body('id') id: string) {
    return this.remindersService.remove(id, user.uid)
  }
}
