import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, In } from 'typeorm'
import { CreateLogDto } from './dto/create-log.dto'
import { UpdateLogDto } from './dto/update-log.dto'
import { Log } from './entities/log.entity'
import { GetLogDto } from './dto/get-log.dto'
import { Company } from '../company/entities/company.entity'
import * as dayjs from 'dayjs'

export interface LogItem extends Log {
  companyName: string
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(uid: number, createLogDto: CreateLogDto): Promise<Log> {
    const newLog = this.logsRepository.create({
      ...createLogDto,
      uid,
    })

    return this.logsRepository.save(newLog)
  }

  async findAll(
    uid: number,
    getLogDto: GetLogDto,
  ): Promise<{
    rows: LogItem[]
    count: number
  }> {
    const { companyId, logType, startDate, endDate, pageNo, pageSize } =
      getLogDto
    const query: any = { uid }

    if (companyId) {
      query.companyId = companyId
    }

    if (logType) {
      query.logType = logType
    }
    if (startDate && endDate) {
      query.createdAt = Between(
        dayjs(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      )
    }

    const [rows, count] = await this.logsRepository.findAndCount({
      where: query,
      order: { createdAt: 'DESC' },
      skip: pageNo && pageSize && pageNo * pageSize,
      take: pageSize,
    })
    const companyIds = rows.map((log) => log.companyId)
    const companies = await this.companyRepository.findBy({
      id: In(companyIds),
    })
    const companyMap = new Map(
      companies.map((company) => [company.id, company.companyName]),
    )
    const result: LogItem[] = rows.map((log) => ({
      ...log,
      companyName: companyMap.get(log.companyId) || '',
    }))

    return {
      rows: result,
      count,
    }
  }

  async findBy(where: GetLogDto, uid: number): Promise<Log[]> {
    return this.logsRepository.findBy({ ...where, uid })
  }

  async findOne(getLogDto: GetLogDto, uid: number): Promise<Log> {
    const log = await this.logsRepository.findOne({
      where: { id: getLogDto.id, uid },
    })

    if (!log) {
      throw new NotFoundException('日志不存在')
    }

    return log
  }

  async update(uid: number, updateLogDto: UpdateLogDto): Promise<Log> {
    const { id, ...updateData } = updateLogDto
    await this.logsRepository.update({ id, uid }, updateData)
    return await this.findOne({ id }, uid)
  }

  async remove(id: string, uid: number): Promise<void> {
    const ids = id.split(',')
    const result = await this.logsRepository.delete({ id: In(ids), uid })
    if (result.affected === 0) {
      throw new NotFoundException('日志不存在')
    }
  }
}
