import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateEntity } from '@/entities/date.entity'

@Entity('memorandums')
export class Memorandum extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column({ name: 'sort_index', default: 0 })
  sortIndex: number

  @Column()
  title: string

  @Column({ type: 'longtext', nullable: true })
  markdown: string
}
