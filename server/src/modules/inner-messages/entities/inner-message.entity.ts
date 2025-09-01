import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('inner_messages')
export class InnerMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  uid: number

  @Column()
  content: string

  @Column({ default: 0, comment: '消息类型, 0=系统消息' })
  type: number

  @Column({ name: 'has_read', default: false })
  hasRead: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
