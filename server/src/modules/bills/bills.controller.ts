import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { BillsService } from './bills.service'
import { CreateBillDto } from './dto/create-bill.dto'
import { UpdateBillDto } from './dto/update-bill.dto'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { User } from '@/decorators/user.decorator'
import { GetBillDto } from './dto/get-bill.dto'

@Controller('bill')
@UseGuards(UserAuthGuard)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('add')
  create(@User('uid') uid: number, @Body() createBillDto: CreateBillDto) {
    return this.billsService.create(uid, createBillDto)
  }

  @Post('getAll')
  findAll(@User('uid') uid: number, @Body() getBillDto: GetBillDto) {
    return this.billsService.findAll(uid, getBillDto)
  }

  @Post('get')
  findOne(@User('uid') uid: number, @Body('id') id: string) {
    return this.billsService.findOne(uid, id)
  }

  @Post('update')
  async update(@User('uid') uid: number, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(uid, updateBillDto)
  }

  @Post('delete')
  async remove(@User('uid') uid: number, @Body('id') id: string) {
    return this.billsService.remove(uid, id)
  }

  @Post('amount/statistics')
  async sumAmount(@User('uid') uid: number, @Body() getBillDto: GetBillDto) {
    try {
      return {
        data: await this.billsService.findSumPriceByDate(uid, getBillDto),
      }
    } catch {
      throw new BadRequestException('获取金额统计失败')
    }
  }

  @Post('amount/group')
  amountGroup(@User('uid') uid: number, @Body() getBillDto: GetBillDto) {
    try {
      return this.billsService.findAmountGroup(uid, getBillDto)
    } catch {
      throw new BadRequestException('获取分组统计失败')
    }
  }
}
