import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { InnerMessagesService } from './inner-messages.service'
import { CreateInnerMessageDto } from './dto/create-inner-message.dto'
import { UpdateInnerMessageDto } from './dto/update-inner-message.dto'

@Controller('inner-messages')
@UseGuards(UserAuthGuard)
export class InnerMessagesController {
  constructor(private readonly innerMessagesService: InnerMessagesService) {}

  @Post()
  create(@Request() req, @Body() createInnerMessageDto: CreateInnerMessageDto) {
    return this.innerMessagesService.create(req.user.uid, createInnerMessageDto)
  }

  @Post('get')
  async findAll(@Request() req) {
    return {
      rows: await this.innerMessagesService.findAll(req.user.uid),
    }
  }

  @Get('unread')
  findUnread(@Request() req) {
    return this.innerMessagesService.findUnread(req.user.uid)
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.innerMessagesService.findOne(id, req.user.uid)
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateInnerMessageDto: UpdateInnerMessageDto,
  ) {
    return this.innerMessagesService.update(
      id,
      req.user.uid,
      updateInnerMessageDto,
    )
  }

  @Patch(':id/read')
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.innerMessagesService.markAsRead(id, req.user.uid)
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.innerMessagesService.remove(id, req.user.uid)
  }
}
