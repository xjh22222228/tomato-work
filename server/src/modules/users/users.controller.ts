import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { User } from '@/decorators/user.decorator'

@Controller('user')
@UseGuards(UserAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('update')
  update(@User('uid') uid: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uid, updateUserDto)
  }
}
