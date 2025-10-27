import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { CreateBillDto } from './dto/create-bill.dto'
import { UpdateBillDto } from './dto/update-bill.dto'
import { Bill } from './entities/bill.entity'
import { BillType } from '../bill-types/entities/bill-type.entity'
import * as dayjs from 'dayjs'
import { GetBillDto } from './dto/get-bill.dto'
import * as lodash from 'lodash'
import BigNumber from 'bignumber.js'

export interface SumPriceResponse {
  date: string
  type: number
  price: number
  name: string
}

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    @InjectRepository(BillType)
    private billTypeRepository: Repository<BillType>,
  ) {}

  async create(uid: number, createBillDto: CreateBillDto): Promise<Bill> {
    // 验证 typeId 是否存在
    const billType = await this.billTypeRepository.findOne({
      where: { id: createBillDto.typeId, uid },
    })

    if (!billType) {
      throw new NotFoundException('账单类型不存在')
    }
    const date = dayjs(createBillDto.date).valueOf()
    const bill = this.billRepository.create({
      ...createBillDto,
      uid,
      date,
    })

    return this.billRepository.save(bill)
  }

  async findAll(
    uid: number,
    getBillDto: GetBillDto,
  ): Promise<{
    rows: Bill[]
    count: number
    consumptionAmount: number
    incomeAmount: number
    availableAmount: number
    discountAmount: number
  }> {
    const {
      pageNo,
      pageSize,
      startDate,
      endDate,
      typeId,
      type,
      keyword,
      sort,
    } = getBillDto
    const queryBuilder = this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.billType', 'billType')
      .where('bill.uid = :uid', { uid })
    if (startDate && endDate) {
      queryBuilder.andWhere('bill.date BETWEEN :startDate AND :endDate', {
        startDate: dayjs(startDate).startOf('day').valueOf(),
        endDate: dayjs(endDate).endOf('day').valueOf(),
      })
    }

    if (typeId) {
      queryBuilder.andWhere('bill.typeId = :typeId', { typeId })
    }

    if (type) {
      queryBuilder.andWhere('billType.type = :type', { type })
    }

    if (keyword) {
      queryBuilder.andWhere('bill.remark LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
    }

    const [field, order] = (sort || 'date-DESC').split('-')
    const fieldName = lodash.snakeCase(field)
    const orderName = order.toUpperCase()
    queryBuilder.orderBy(`bill.${fieldName}`, orderName as any)

    const result = await queryBuilder.getMany()
    let consumptionAmount = new BigNumber(0)
    let incomeAmount = new BigNumber(0)
    let availableAmount = new BigNumber(0)
    let discountAmount = new BigNumber(0)

    result.forEach((item) => {
      const price = new BigNumber(item.price)
      if (item.billType.type === 1) {
        incomeAmount = incomeAmount.plus(price)
      } else {
        consumptionAmount = consumptionAmount.plus(price)
      }
      if (item.originalAmount != null) {
        discountAmount = discountAmount.plus(
          new BigNumber(item.originalAmount).minus(price),
        )
      }
    })

    availableAmount = incomeAmount.minus(consumptionAmount)

    if (pageNo && pageSize) {
      const skip = pageNo * pageSize
      queryBuilder.skip(skip).take(pageSize)
    }

    const [rows, count] = await queryBuilder.getManyAndCount()

    return {
      rows,
      count,
      consumptionAmount: consumptionAmount.toNumber(),
      incomeAmount: incomeAmount.toNumber(),
      availableAmount: availableAmount.toNumber(),
      discountAmount: discountAmount.toNumber(),
    }
  }

  async findOne(uid: number, id: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id, uid },
      relations: ['billType'],
    })

    if (!bill) {
      throw new NotFoundException('账单不存在')
    }

    return bill
  }

  async update(uid: number, updateBillDto: UpdateBillDto): Promise<void> {
    const { id, ...updateData } = updateBillDto
    const bill = await this.findOne(uid, id)

    // 检查是否更新 typeId，如果更新则验证存在性
    if (updateBillDto.typeId && updateBillDto.typeId !== bill.typeId) {
      const billType = await this.billTypeRepository.findOne({
        where: { id: updateBillDto.typeId, uid },
      })

      if (!billType) {
        throw new NotFoundException('账单类型不存在')
      }
    }

    await this.billRepository.update(
      { id, uid },
      {
        ...updateData,
        date: dayjs(updateBillDto.date).valueOf(),
      },
    )
  }

  async remove(uid: number, id: string): Promise<void> {
    const ids = id.split(',')
    const result = await this.billRepository.delete({ id: In(ids), uid })
    if (result.affected === 0) {
      throw new NotFoundException('账单不存在或已删除')
    }
  }

  async findSumPriceByDate(
    uid: number,
    getBillDto: GetBillDto,
  ): Promise<SumPriceResponse[]> {
    const startDate = getBillDto.startDate
    const endDate = getBillDto.endDate
    // 通过关联查询获取收入和支出总额
    const result = await this.billRepository.query(
      `SELECT 
      SUM(a.price) AS price,
      b.type,
      DATE(a.created_at) AS date
      from bills AS a,
      bill_types AS b
      WHERE a.type_id = b.id AND a.uid = ? AND DATE(a.created_at) >= ? AND DATE(a.created_at) <= ? 
      GROUP BY b.type,
      DATE(a.created_at)
      ORDER BY DATE(a.created_at);`,
      [uid, startDate, endDate],
    )

    // 两个日期的时间差
    const startDateObject = dayjs(startDate)
    const endDateObject = dayjs(endDate)
    const diffDay = endDateObject.diff(startDateObject, 'day') + 1
    const data: SumPriceResponse[] = []

    // 补录日期, 查出来的数据有些日期没有
    for (let i = 0; i < diffDay; i++) {
      const payload = {
        date: dayjs(startDate).add(i, 'd').format('YYYY-MM-DD'),
        price: 0,
        name: '收入',
        type: 1,
      }
      data.push(payload, {
        ...payload,
        name: '支出',
        type: 2,
      })
    }

    result.forEach((item) => {
      const idx = data.findIndex(
        (el) =>
          dayjs(el.date).format('YYYY-MM-DD') ===
          dayjs(item.date).format('YYYY-MM-DD'),
      )

      if (idx >= 0) {
        if (item.type === 1) {
          data[idx].price = item.price
        } else {
          data[idx + 1].price = item.price
        }
      }
    })

    return data
  }

  async findAmountGroup(uid: number, getBillDto: GetBillDto): Promise<any[]> {
    // 按账单类型分组统计金额
    const result = this.billRepository.query(
      `
      SELECT 
      SUM(f.price) as amount, t.type, t.name
      FROM bills AS f
      INNER JOIN bill_types as t
      ON f.uid = ? AND t.id = f.type_id
      AND DATE(f.created_at) >= ? AND DATE(f.created_at) <= ?
      GROUP BY t.type, t.name;
        `,
      [uid, getBillDto.startDate, getBillDto.endDate],
    )

    return await result
  }
}
