import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateEntity } from '@/entities/date.entity'

@Entity('user_configures')
export class UserConfigure extends DateEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column({ unique: true })
  uid: number

  @Column({ name: 'is_task_notify', default: true, comment: '待办任务通知' })
  isTaskNotify: boolean

  @Column({ name: 'is_matter_notify', default: true, comment: '提醒事项通知' })
  isMatterNotify: boolean

  @Column({
    name: 'server_chan_sckey',
    default: '',
    comment: '企业微信API KEY',
  })
  serverChanSckey: string
}
