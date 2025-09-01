import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateEntity } from '@/entities/date.entity'

@Entity('bill_types')
export class BillType extends DateEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column()
  uid: number

  @Column({ name: 'sort_index', default: 0 })
  sortIndex: number

  @Column({ length: 20, default: '' })
  name: string

  @Column({ default: 1, comment: '1=收入, 2=支出' })
  type: number
}
