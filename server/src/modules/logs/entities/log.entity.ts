import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateEntity } from '@/entities/date.entity'

@Entity('logs')
export class Log extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column({ name: 'company_id' })
  companyId: string

  @Column({ name: 'log_type', comment: '日志类型, 1=日报、2=周报、3=月报' })
  logType: number

  @Column({ name: 'done_content', type: 'text' })
  doneContent: string

  @Column({ name: 'undone_content', type: 'text' })
  undoneContent: string

  @Column({ name: 'plan_content', type: 'text' })
  planContent: string

  @Column({ name: 'summary_content', type: 'text' })
  summaryContent: string
}
