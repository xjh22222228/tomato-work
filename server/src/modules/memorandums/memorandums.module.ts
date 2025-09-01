import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemorandumsService } from './memorandums.service'
import { MemorandumsController } from './memorandums.controller'
import { Memorandum } from './entities/memorandum.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Memorandum])],
  controllers: [MemorandumsController],
  providers: [MemorandumsService],
  exports: [MemorandumsService],
})
export class MemorandumsModule {}
