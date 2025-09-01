import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, LessThan, Repository, Not, In } from 'typeorm'
import * as dayjs from 'dayjs'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task, TaskType } from './entities/task.entity'
import { GetTaskDto } from './dto/get-task.dto'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(uid: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.tasksRepository.create({
      ...createTaskDto,
      uid,
    })

    return this.tasksRepository.save(newTask)
  }

  async findAll(uid: number, getTaskDto: GetTaskDto): Promise<Task[]> {
    const startOfDay = dayjs(getTaskDto.startDate).startOf('day').valueOf()
    const endOfDay = dayjs(getTaskDto.endDate).endOf('day').valueOf()

    return this.tasksRepository.find({
      where: {
        uid,
        date: Between(startOfDay, endOfDay),
      },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string, uid: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, uid },
    })

    if (!task) {
      throw new NotFoundException('任务不存在')
    }

    return task
  }

  async update(uid: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { id, ...updateData } = updateTaskDto
    await this.tasksRepository.update({ uid, id }, updateData)
    return await this.findOne(id, uid)
  }

  async remove(id: string, uid: number): Promise<void> {
    const result = await this.tasksRepository.delete({ id, uid })
    if (result.affected === 0) {
      throw new NotFoundException('任务不存在')
    }
  }

  async updateBeforeToDay() {
    await this.tasksRepository.update(
      {
        date: LessThan(dayjs().startOf('day').valueOf()),
        type: Not(In([TaskType.COMPLETED, TaskType.UNCOMPLETED])),
      },
      {
        type: TaskType.UNCOMPLETED,
      },
    )
  }
}
