import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { Task } from './entities/task.entity'
import { TaskScheduleService } from './task-schedule.service'

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService, TaskScheduleService],
  exports: [TasksService],
})
export class TasksModule {}
