import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserConfiguresService } from './user-configures.service'
import { UserConfiguresController } from './user-configures.controller'
import { UserConfigure } from './entities/user-configure.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserConfigure])],
  controllers: [UserConfiguresController],
  providers: [UserConfiguresService],
  exports: [UserConfiguresService],
})
export class UserConfiguresModule {}
