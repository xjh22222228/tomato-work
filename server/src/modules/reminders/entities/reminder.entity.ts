import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { dateTransformer } from '@/utils/transformerUtils'
import { DateEntity } from '@/entities/date.entity'

@Entity('reminders')
export class Reminder extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column()
  content: string

  @Column({
    length: 20,
    comment: 'cron表达式',
    default: null,
  })
  cron: string

  @Column({
    type: 'bigint',
    transformer: dateTransformer(),
    comment: '提醒时间',
  })
  date: number

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '事项类型, 1=待提醒, 2=已提醒',
  })
  type: number
}
