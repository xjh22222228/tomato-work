import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BillTypesService } from './bill-types.service'
import { BillTypesController } from './bill-types.controller'
import { BillType } from './entities/bill-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BillType])],
  controllers: [BillTypesController],
  providers: [BillTypesService],
  exports: [BillTypesService],
})
export class BillTypesModule {}
