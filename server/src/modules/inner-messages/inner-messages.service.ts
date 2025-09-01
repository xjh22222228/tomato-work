import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { CreateInnerMessageDto } from './dto/create-inner-message.dto'
import { UpdateInnerMessageDto } from './dto/update-inner-message.dto'
import { InnerMessage } from './entities/inner-message.entity'

@Injectable()
export class InnerMessagesService {
  constructor(
    @InjectRepository(InnerMessage)
    private innerMessagesRepository: Repository<InnerMessage>,
  ) {}

  async create(
    uid: number,
    createInnerMessageDto: CreateInnerMessageDto,
  ): Promise<InnerMessage> {
    const newInnerMessage = this.innerMessagesRepository.create({
      ...createInnerMessageDto,
      uid,
      id: uuidv4(),
      type: createInnerMessageDto.type || 0,
      hasRead: createInnerMessageDto.hasRead || false,
    })

    return this.innerMessagesRepository.save(newInnerMessage)
  }

  async findAll(uid: number): Promise<InnerMessage[]> {
    return this.innerMessagesRepository.find({
      where: { uid },
      order: { createdAt: 'DESC' },
    })
  }

  async findUnread(uid: number): Promise<InnerMessage[]> {
    return this.innerMessagesRepository.find({
      where: { uid, hasRead: false },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string, uid: number): Promise<InnerMessage> {
    const innerMessage = await this.innerMessagesRepository.findOne({
      where: { id, uid },
    })

    if (!innerMessage) {
      throw new NotFoundException('消息不存在')
    }

    return innerMessage
  }

  async update(
    id: string,
    uid: number,
    updateInnerMessageDto: UpdateInnerMessageDto,
  ): Promise<InnerMessage> {
    const innerMessage = await this.findOne(id, uid)
    const updatedInnerMessage = Object.assign(
      innerMessage,
      updateInnerMessageDto,
    )
    return this.innerMessagesRepository.save(updatedInnerMessage)
  }

  async markAsRead(id: string, uid: number): Promise<InnerMessage> {
    const innerMessage = await this.findOne(id, uid)
    innerMessage.hasRead = true
    return this.innerMessagesRepository.save(innerMessage)
  }

  async remove(id: string, uid: number): Promise<void> {
    const result = await this.innerMessagesRepository.delete({ id, uid })
    if (result.affected === 0) {
      throw new NotFoundException('消息不存在')
    }
  }
}
