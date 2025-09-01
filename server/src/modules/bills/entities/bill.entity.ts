import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BillType } from '../..//bill-types/entities/bill-type.entity'
import { DateEntity } from '@/entities/date.entity'
import { numberTransformer } from '@/utils/transformerUtils'

@Entity('bills')
export class Bill extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 2,
    default: 0,
    transformer: numberTransformer(),
  })
  price: number

  @Column({ type: 'bigint', transformer: numberTransformer() })
  date: number

  @Column({ name: 'type_id' })
  typeId: string

  @Column({ length: 250, default: '' })
  remark: string

  @Column({ type: 'text', nullable: true })
  imgs: string

  @ManyToOne(() => BillType)
  @JoinColumn({ name: 'type_id' })
  billType: BillType
}
