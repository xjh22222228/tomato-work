import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'
import { GetCompanyDto } from './dto/get-company.dto'
import { LogsService } from '../logs/logs.service'

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private readonly logsService: LogsService,
  ) {}

  async create(
    uid: number,
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    const newCompany = this.companyRepository.create({
      ...createCompanyDto,
      uid,
    })

    return this.companyRepository.save(newCompany)
  }

  async findAll(
    uid: number,
    getCompanyDto: GetCompanyDto,
  ): Promise<{
    rows: Company[]
    count: number
  }> {
    const { pageNo, pageSize } = getCompanyDto

    const [rows, count] = await this.companyRepository.findAndCount({
      where: { uid },
      order: { startDate: 'DESC' },
      skip: pageNo && pageSize && pageNo * pageSize,
      take: pageSize,
    })
    return {
      rows,
      count,
    }
  }

  async findOne(id: string, uid: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id, uid },
    })

    if (!company) {
      throw new NotFoundException('公司不存在')
    }

    return company
  }

  async findByIds(ids: string[]): Promise<Company[]> {
    return this.companyRepository.findBy({
      id: In(ids),
    })
  }

  async update(
    uid: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const { id, ...updateData } = updateCompanyDto
    await this.companyRepository.update({ id, uid }, updateData)
    return this.findOne(id, uid)
  }

  async remove(id: string, uid: number): Promise<void> {
    const ids = id.split(',')
    const logs = await this.logsService.findBy(
      {
        companyId: In(ids) as unknown as string,
      },
      uid,
    )
    if (logs.length > 0) {
      throw new InternalServerErrorException(
        `公司下存在日志，无法删除 ${logs.map((log) => log.id).join(',')}`,
      )
    }
    const result = await this.companyRepository.delete({ id: In(ids), uid })
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
