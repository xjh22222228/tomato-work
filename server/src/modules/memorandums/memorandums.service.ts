import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateMemorandumDto } from './dto/create-memorandum.dto'
import { UpdateMemorandumDto } from './dto/update-memorandum.dto'
import { Memorandum } from './entities/memorandum.entity'
import { GetMemorandumDto } from './dto/get-memorandum.dto'
import markdown from '@/utils/markdown'

export interface MemorandumItem extends Memorandum {
  html: string
}

@Injectable()
export class MemorandumsService {
  constructor(
    @InjectRepository(Memorandum)
    private memorandumsRepository: Repository<Memorandum>,
  ) {}

  async create(
    uid: number,
    createMemorandumDto: CreateMemorandumDto,
  ): Promise<Memorandum> {
    const newMemorandum = this.memorandumsRepository.create({
      ...createMemorandumDto,
      uid,
    })

    return this.memorandumsRepository.save(newMemorandum)
  }

  async findAll(
    uid: number,
    getMemorandumDto: GetMemorandumDto,
  ): Promise<{
    rows: MemorandumItem[]
    count: number
  }> {
    const { pageNo, pageSize } = getMemorandumDto
    const [rows, count] = await this.memorandumsRepository.findAndCount({
      where: { uid },
      order: { updatedAt: 'DESC' },
      skip: pageNo && pageSize && pageNo * pageSize,
      take: pageSize,
    })
    const result = rows.map((item) => {
      const html = markdown.render(item.markdown)
      return {
        ...item,
        html,
      }
    })
    return {
      rows: result,
      count,
    }
  }

  async findOne(id: string, uid: number): Promise<MemorandumItem> {
    const memorandum = await this.memorandumsRepository.findOne({
      where: { id, uid },
    })

    if (!memorandum) {
      throw new NotFoundException('备忘录不存在')
    }

    return {
      ...memorandum,
      html: markdown.render(memorandum.markdown),
    }
  }

  async update(
    uid: number,
    updateMemorandumDto: UpdateMemorandumDto,
  ): Promise<Memorandum> {
    const { id, ...updateData } = updateMemorandumDto
    await this.memorandumsRepository.update({ uid, id }, updateData)
    return this.findOne(id, uid)
  }

  async remove(id: string, uid: number): Promise<void> {
    const result = await this.memorandumsRepository.delete({ id, uid })
    if (result.affected === 0) {
      throw new NotFoundException('备忘录不存在')
    }
  }
}
