import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { CreateBillTypeDto } from './dto/create-bill-type.dto'
import { UpdateBillTypeDto } from './dto/update-bill-type.dto'
import { BillType } from './entities/bill-type.entity'

@Injectable()
export class BillTypesService {
  constructor(
    @InjectRepository(BillType)
    private billTypeRepository: Repository<BillType>,
  ) {}

  async create(
    uid: number,
    createBillTypeDto: CreateBillTypeDto,
  ): Promise<BillType> {
    // 检查同用户下是否已存在相同名称的类型
    const existingBillType = await this.findOneByName(uid, createBillTypeDto)
    if (existingBillType) {
      throw new ConflictException('不可重复创建')
    }

    const billType = this.billTypeRepository.create({
      uid,
      ...createBillTypeDto,
    })

    return this.billTypeRepository.save(billType)
  }

  async findAll(uid: number): Promise<BillType[]> {
    const billTypes = this.billTypeRepository.find({
      where: { uid },
      order: { type: 'DESC' },
    })
    return billTypes
  }

  async findOne(uid: number, id: string): Promise<BillType> {
    const billType = await this.billTypeRepository.findOne({
      where: { id, uid },
    })

    if (!billType) {
      throw new NotFoundException('账单类型不存在')
    }

    return billType
  }

  async findOneByName(
    uid: number,
    updateBillTypeDto: Partial<UpdateBillTypeDto>,
  ): Promise<BillType | null> {
    return this.billTypeRepository.findOne({
      where: { ...updateBillTypeDto, uid },
    })
  }

  async update(
    uid: number,
    updateBillTypeDto: UpdateBillTypeDto,
  ): Promise<void> {
    const { id, ...updateData } = updateBillTypeDto
    // 获取现有实体以确保它存在
    await this.findOne(uid, id)

    // 如果更新名称，检查是否与其他类型重复
    if (updateBillTypeDto.name) {
      const existingBillType = await this.findOneByName(uid, {
        name: updateBillTypeDto.name,
        type: updateBillTypeDto.type,
      })
      if (existingBillType && existingBillType.id !== id) {
        throw new ConflictException('类型名称已存在')
      }
    }

    await this.billTypeRepository.update({ id, uid }, updateData)
  }

  async remove(uid: number, ids: string[]): Promise<void> {
    try {
      const result = await this.billTypeRepository.delete({
        id: In(ids),
        uid,
      })

      if (result.affected === 0) {
        throw new NotFoundException('账单类型不存在或已删除')
      }
    } catch {
      throw new InternalServerErrorException('请先删除账单关类型数据')
    }
  }
}
