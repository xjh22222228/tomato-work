import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { UserConfiguresService } from './user-configures.service'
import { UpdateUserConfigureDto } from './dto/update-user-configure.dto'
import { User } from '@/decorators/user.decorator'

@Controller('user-configure')
@UseGuards(UserAuthGuard)
export class UserConfiguresController {
  constructor(private readonly userConfiguresService: UserConfiguresService) {}

  @Post('get')
  findOne(@User() user) {
    return this.userConfiguresService.findOrCreate(user.uid)
  }

  @Post('update')
  update(@User() user, @Body() updateUserConfigureDto: UpdateUserConfigureDto) {
    return this.userConfiguresService.update(user.uid, updateUserConfigureDto)
  }
}
