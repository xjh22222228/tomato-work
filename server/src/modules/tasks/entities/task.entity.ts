import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateEntity } from '@/entities/date.entity'
import { dateTransformer } from '@/utils/transformerUtils'

export const enum TaskType {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  UNCOMPLETED = 4,
}

@Entity('tasks')
export class Task extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column()
  content: string

  @Column({ type: 'bigint', transformer: dateTransformer() })
  date: number

  @Column({
    type: 'tinyint',
    default: TaskType.PENDING,
    comment: '进度类型: 1=待作业, 2=作业中, 3=已完成, 4=未完成',
  })
  type: number

  @Column({ type: 'tinyint', default: 0, comment: '待办优先级, 0-5' })
  count: number
}
