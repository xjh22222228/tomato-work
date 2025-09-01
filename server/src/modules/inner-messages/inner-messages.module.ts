import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InnerMessagesService } from './inner-messages.service'
import { InnerMessagesController } from './inner-messages.controller'
import { InnerMessage } from './entities/inner-message.entity'

@Module({
  imports: [TypeOrmModule.forFeature([InnerMessage])],
  controllers: [InnerMessagesController],
  providers: [InnerMessagesService],
  exports: [InnerMessagesService],
})
export class InnerMessagesModule {}
