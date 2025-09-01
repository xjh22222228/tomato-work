import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { TasksService } from './tasks.service'

@Injectable()
export class TaskScheduleService {
  private readonly logger = new Logger(TaskScheduleService.name)

  constructor(private tasksService: TasksService) {}

  /**
   * 每天凌晨 0 点 0 分 1 秒执行
   */
  @Cron('1 0 0 * * *')
  // @Cron('*/5 * * * * *') // 每 5 秒执行一次，用于调试
  async handleCron() {
    this.logger.debug('定时任务 - 今日待办未完成设置')
    this.tasksService.updateBeforeToDay()
  }
}
