import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateEntity } from '@/entities/date.entity'
import { dateTransformer } from '@/utils/transformerUtils'

@Entity('company')
export class Company extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column({ name: 'company_name' })
  companyName: string

  @Column({
    name: 'start_date',
    type: 'datetime',
    transformer: dateTransformer(),
  })
  startDate: Date

  @Column({
    name: 'end_date',
    type: 'datetime',
    nullable: true,
    transformer: dateTransformer(),
  })
  endDate: Date

  @Column({ type: 'text' })
  remark: string

  @Column({ type: 'decimal', precision: 19, scale: 2 })
  amount: number

  @Column({
    name: 'expect_leave_date',
    type: 'datetime',
    nullable: true,
    transformer: dateTransformer(),
  })
  expectLeaveDate: Date
}
