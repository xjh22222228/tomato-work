import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryColumn()
  uid: number

  @Column({ default: 'github' })
  provider: string

  @Column({ name: 'login_name', default: '' })
  loginName: string

  @Column({ default: '' })
  username: string

  @Column({ default: '' })
  password: string

  @Column({ default: '' })
  token: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  bio: string

  @Column({ nullable: true })
  email: string

  @Column({ name: 'ip_addr', nullable: true })
  ipAddr: string

  @Column({ default: 1 })
  role: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
