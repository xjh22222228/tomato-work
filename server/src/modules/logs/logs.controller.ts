import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { LogsService } from './logs.service'
import { CreateLogDto } from './dto/create-log.dto'
import { UpdateLogDto } from './dto/update-log.dto'
import { User } from '@/decorators/user.decorator'
import { GetLogDto } from './dto/get-log.dto'

@Controller('log')
@UseGuards(UserAuthGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('add')
  create(@User() user, @Body() createLogDto: CreateLogDto) {
    return this.logsService.create(user.uid, createLogDto)
  }

  @Post('getAll')
  findAll(@User() user, @Body() getLogDto: GetLogDto) {
    return this.logsService.findAll(user.uid, getLogDto)
  }

  @Post('get')
  findOne(@User() user, @Body() getLogDto: GetLogDto) {
    const { pageNo, pageSize, ...dto } = getLogDto
    return this.logsService.findOne(dto, user.uid)
  }

  @Post('update')
  update(@User() user, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.update(user.uid, updateLogDto)
  }

  @Post('delete')
  remove(@User() user, @Body('id') id: string) {
    return this.logsService.remove(id, user.uid)
  }
}
