import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { dateTransformer } from '@/utils/transformerUtils'

@Entity('todo_lists')
export class TodoList {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column('text')
  content: string

  @Column({ type: 'tinyint', default: 1, comment: '状态, 1=进行中, 2=完成' })
  status: number

  @CreateDateColumn({ name: 'created_at', transformer: dateTransformer() })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', transformer: dateTransformer() })
  updatedAt: Date
}
