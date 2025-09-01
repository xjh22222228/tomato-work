import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { MemorandumsService } from './memorandums.service'
import { CreateMemorandumDto } from './dto/create-memorandum.dto'
import { UpdateMemorandumDto } from './dto/update-memorandum.dto'
import { User } from '@/decorators/user.decorator'
import { GetMemorandumDto } from './dto/get-memorandum.dto'

@Controller('memorandum')
@UseGuards(UserAuthGuard)
export class MemorandumsController {
  constructor(private readonly memorandumsService: MemorandumsService) {}

  @Post('add')
  create(@User() user, @Body() createMemorandumDto: CreateMemorandumDto) {
    return this.memorandumsService.create(user.uid, createMemorandumDto)
  }

  @Post('getAll')
  findAll(@User() user, @Body() getMemorandumDto: GetMemorandumDto) {
    return this.memorandumsService.findAll(user.uid, getMemorandumDto)
  }

  @Post('get')
  findOne(@User() user, @Body('id') id: string) {
    return this.memorandumsService.findOne(id, user.uid)
  }

  @Post('update')
  update(@User() user, @Body() updateMemorandumDto: UpdateMemorandumDto) {
    return this.memorandumsService.update(user.uid, updateMemorandumDto)
  }

  @Post('delete')
  remove(@User() user, @Body('id') id: string) {
    return this.memorandumsService.remove(id, user.uid)
  }
}
