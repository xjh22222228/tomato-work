import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { GetCompanyDto } from './dto/get-company.dto'

@Controller('company')
@UseGuards(UserAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('add')
  create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(req.user.uid, createCompanyDto)
  }

  @Post('getAll')
  findAll(@Request() req, @Body() getCompanyDto: GetCompanyDto) {
    return this.companyService.findAll(req.user.uid, getCompanyDto)
  }

  @Post('get')
  findOne(@Request() req, @Body('id') id: string) {
    return this.companyService.findOne(id, req.user.uid)
  }

  @Post('update')
  update(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(req.user.uid, updateCompanyDto)
  }

  @Post('delete')
  remove(@Request() req, @Body('id') id: string) {
    return this.companyService.remove(id, req.user.uid)
  }
}
