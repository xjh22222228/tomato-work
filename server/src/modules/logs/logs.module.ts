import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogsService } from './logs.service'
import { LogsController } from './logs.controller'
import { Log } from './entities/log.entity'
import { Company } from '../company/entities/company.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Log, Company])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
