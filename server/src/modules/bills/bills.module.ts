import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BillsService } from './bills.service'
import { BillsController } from './bills.controller'
import { Bill } from './entities/bill.entity'
import { BillTypesModule } from '../bill-types/bill-types.module'
import { BillType } from '../bill-types/entities/bill-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Bill, BillType]), BillTypesModule],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
