import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { Company } from './entities/company.entity'
import { LogsModule } from '../logs/logs.module'

@Module({
  imports: [TypeOrmModule.forFeature([Company]), LogsModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
