import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import axios from 'axios'
import { RemindersService } from '../reminders/reminders.service'
import { getNextCronExecution } from '@/utils/cronUtils'

interface MailData {
  to: string
  subject: string
  html?: string
  text?: string
  markdown?: string
  sckey?: string
}

interface ReminderUser {
  [email: string]: {
    content: string[]
    ids: string[]
    sckey?: string
    cron?: string
  }
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter

  constructor(
    private configService: ConfigService,
    private remindersService: RemindersService,
  ) {
    this.initTransporter()
  }

  private initTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    })
  }

  /**
   * 微信推送
   */
  async wechatPush(data: MailData) {
    if (!data.sckey) return

    const params = {
      msgtype: 'markdown',
      markdown: {
        content: `
# ${data.subject || ''}

${data.markdown || ''}
`,
      },
    }

    try {
      await axios.post(
        `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${data.sckey}`,
        params,
      )
    } catch (error) {
      this.logger.error(`微信推送失败: ${error.message}`)
    }
  }

  /**
   * 注册通知
   */
  async register(loginName: string) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL')
    if (!adminEmail) return

    await this.send({
      to: adminEmail,
      subject: '用户注册通知',
      html: `用户：${loginName} 成功注册了本站`,
    })
  }

  /**
   * 发送邮件，总是使用这个service进行发送
   * @param data 邮件数据
   */
  async send(data: MailData) {
    if (!data.to) {
      return
    }

    let retries = 3

    // 尝试发送 retries 次
    while (retries--) {
      try {
        const mailOptions = {
          from: this.configService.get<string>('MAIL_USER'),
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        }

        const result = await this.transporter.sendMail(mailOptions)
        this.logger.log(`邮箱: ${data.to} 发送成功`)
        return result
      } catch (err) {
        this.logger.error(`邮箱：${data.to} 发送失败，原因：${err.message}`)
        if (retries <= 0) {
          throw err
        }
      }
    }
  }

  /**
   * 发送提醒事项
   */
  async sendReminder() {
    try {
      // 获取未发送的提醒事项
      const reminderItems = await this.remindersService.findAllNotSend()
      this.logger.log(`待发送数量: ${reminderItems.length}`)
      const user: ReminderUser = {}

      // 合并同一用户多个事项
      reminderItems.forEach((item) => {
        const { email, content, id, sckey, cron } = item

        if (email in user) {
          user[email].content.push(content)
          user[email].ids.push(id)
        } else {
          user[email] = {
            content: [content],
            ids: [id],
            sckey,
            cron,
          }
        }

        if (cron) {
          const date = getNextCronExecution(cron)
          if (date) {
            this.remindersService.updateByIds([id], { date })
          }
        } else {
          this.remindersService.updateByIds([id], { type: 2 })
        }
      })

      // 推送
      for (let email in user) {
        const { content, sckey } = user[email]
        let html = ''
        let markdown = ''

        content.forEach((text, idx) => {
          html += `<h2>${idx + 1}：${text}</h2>`
          markdown += `${idx + 1}：${text}\n`
        })

        const mailData = {
          to: email,
          subject: content.join('；'),
          html,
          sckey,
          markdown,
        }

        try {
          await Promise.allSettled([
            this.wechatPush(mailData),
            this.send(mailData),
          ])
        } catch (error) {
          this.logger.error(`发送提醒邮件失败: ${error.message}`)
        }
      }
    } catch (err) {
      this.logger.error(`发送提醒事项失败: ${err.message}`)
    }
  }
}
