import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import * as dayjs from 'dayjs'
import * as svgCaptcha from 'svg-captcha'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { User } from '@/decorators/user.decorator'
import { CommonService } from './common.service'
import { BillsService } from '../bills/bills.service'
import { TasksService } from '../tasks/tasks.service'
import { TodoListsService } from '../todo-lists/todo-lists.service'
import { RemindersService } from '../reminders/reminders.service'

@Controller()
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly billsService: BillsService,
    private readonly tasksService: TasksService,
    private readonly todoListsService: TodoListsService,
    private readonly remindersService: RemindersService,
  ) {}

  @Get()
  getIndex(): string {
    return 'Welcome to Tomaro Work !'
  }

  @Get('captcha')
  getCaptcha(@Query('code') code: string = '1234', @Res() res: Response): void {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      noise: 2,
      color: true,
      background: '#f0f0f0',
    })

    res.type('svg')
    res.send(captcha.data)
  }

  @Post('panel')
  @UseGuards(UserAuthGuard)
  async getPanelData(@User() user) {
    // 获取当前日期
    const currentDate = dayjs().format('YYYY-MM-DD')

    // 并行获取各项数据
    const [consumption, todayTasks, unfinishedTodoLists, reminders] =
      await Promise.all([
        this.billsService.findSumPriceByDate(user.uid, {
          startDate: currentDate,
          endDate: currentDate,
        }), // 支出类型
        this.tasksService.findAll(user.uid, {
          startDate: currentDate,
          endDate: currentDate,
        }),
        this.todoListsService.findAll(user.uid, { status: 1 }), // 未完成的待办
        this.remindersService.findAll(user.uid, { type: 1 }), // 类型1的提醒
      ])

    return {
      consumption: consumption.find((item) => item.type === 2)?.price,
      todayTaskCount: todayTasks.length,
      unfinishedTodoListCount: unfinishedTodoLists.rows.length,
      reminderCount: reminders.count,
    }
  }
}
