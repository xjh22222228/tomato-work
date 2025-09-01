import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, In } from 'typeorm'
import { CreateTodoListDto } from './dto/create-todo-list.dto'
import { UpdateTodoListDto } from './dto/update-todo-list.dto'
import { TodoList } from './entities/todo-list.entity'
import { GetTodoListDto } from './dto/get-todo-list.dto'
import * as dayjs from 'dayjs'
import { PAGE_SIZE } from '@/constants/pagination'

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private todoListsRepository: Repository<TodoList>,
  ) {}

  async create(
    uid: number,
    createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    const newTodoList = this.todoListsRepository.create({
      ...createTodoListDto,
      uid,
    })

    return this.todoListsRepository.save(newTodoList)
  }

  async findAll(
    uid: number,
    getTodoListDto: GetTodoListDto,
  ): Promise<{ rows: TodoList[]; count: number }> {
    const {
      startDate: start,
      endDate: end,
      status,
      pageNo,
      pageSize = PAGE_SIZE,
    } = getTodoListDto

    const format = 'YYYY-MM-DD HH:mm:ss'
    const startDate = start
      ? dayjs(start).format(format)
      : dayjs().startOf('year').format(format)
    const endDate = end
      ? dayjs(end).endOf('day').format(format)
      : dayjs().endOf('year').format(format)

    const where = {
      uid,
      createdAt: Between(startDate, endDate) as unknown as Date,
    }
    if (status) {
      where['status'] = status
    }

    const [rows, count] = await this.todoListsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: pageNo ? pageNo * pageSize : undefined,
      take: pageNo ? pageSize : undefined,
    })
    return {
      rows,
      count,
    }
  }

  async findOne(id: string, uid: number): Promise<TodoList> {
    const todoList = await this.todoListsRepository.findOne({
      where: { id, uid },
    })

    if (!todoList) {
      throw new NotFoundException()
    }

    return todoList
  }

  async update(
    uid: number,
    updateTodoListDto: UpdateTodoListDto,
  ): Promise<TodoList> {
    const { id, ...updateData } = updateTodoListDto
    await this.todoListsRepository.update({ uid, id }, updateData)
    return this.findOne(id, uid)
  }

  async remove(id: string, uid: number): Promise<void> {
    const ids = id.split(',')
    const result = await this.todoListsRepository.delete({ id: In(ids), uid })
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
