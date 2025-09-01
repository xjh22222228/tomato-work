import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { MailService } from './mail.service'

@Injectable()
export class MailScheduleService {
  private readonly logger = new Logger(MailScheduleService.name)

  constructor(private mailService: MailService) {}

  /**
   * 每分钟检查一次是否有提醒需要发送
   */
  @Cron('0 * * * * *')
  async handleCron() {
    this.logger.debug('定时任务 - 检查提醒事项')
    await this.mailService.sendReminder()
  }
}
