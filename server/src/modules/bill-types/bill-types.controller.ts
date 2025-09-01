import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { BillTypesService } from './bill-types.service'
import { CreateBillTypeDto } from './dto/create-bill-type.dto'
import { UpdateBillTypeDto } from './dto/update-bill-type.dto'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { User } from '@/decorators/user.decorator'

@Controller('bill-type')
@UseGuards(UserAuthGuard)
export class BillTypesController {
  constructor(private readonly billTypesService: BillTypesService) {}

  @Post('add')
  create(
    @User('uid') uid: number,
    @Body() createBillTypeDto: CreateBillTypeDto,
  ) {
    return this.billTypesService.create(uid, createBillTypeDto)
  }

  @Post('getAll')
  async findAll(@User('uid') uid: number) {
    return this.billTypesService.findAll(uid)
  }

  @Post('get')
  findOne(@User('uid') uid: number, @Body('id') id: string) {
    return this.billTypesService.findOne(uid, id)
  }

  @Post('update')
  async update(
    @User('uid') uid: number,
    @Body() updateBillTypeDto: UpdateBillTypeDto,
  ) {
    await this.billTypesService.update(uid, updateBillTypeDto)
    return { msg: '更新成功' }
  }

  @Post('delete')
  async remove(@User('uid') uid: number, @Body('ids') ids: string[]) {
    return this.billTypesService.remove(uid, ids)
  }
}
