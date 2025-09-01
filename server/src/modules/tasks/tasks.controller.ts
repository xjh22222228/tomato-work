import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { User } from '@/decorators/user.decorator'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { GetTaskDto } from './dto/get-task.dto'
import { Task } from './entities/task.entity'

@Controller('task')
@UseGuards(UserAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('add')
  create(@User() user, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(user.uid, createTaskDto)
  }

  @Post('getAll')
  async findAll(@User() user, @Body() getTaskDto: GetTaskDto) {
    const tasks = await this.tasksService.findAll(user.uid, getTaskDto)
    const data: Record<string, Task[]> = {
      wait: [],
      process: [],
      finished: [],
      unfinished: [],
    }

    tasks.forEach((item) => {
      switch (item.type) {
        case 1:
          data.wait.push(item)
          break
        case 2:
          data.process.push(item)
          break
        case 3:
          data.finished.push(item)
          break
        case 4:
          data.unfinished.push(item)
          break
        default:
      }
    })
    return data
  }

  @Post('get')
  findOne(@User() user, @Body('id') id: string) {
    return this.tasksService.findOne(id as string, user.uid)
  }

  @Post('update')
  update(@User() user, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(user.uid, updateTaskDto)
  }

  @Post('delete')
  remove(@User() user, @Body('id') id: string) {
    return this.tasksService.remove(id, user.uid)
  }
}
