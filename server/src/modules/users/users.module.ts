import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { UserControllerAuthGuard } from './guards/user-controller-auth.guard'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserControllerAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
