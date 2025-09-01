import { CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { dateTransformer } from '@/utils/transformerUtils'

export class DateEntity {
  // mysql 默认值需要设置  CURRENT_TIMESTAMP
  @CreateDateColumn({ name: 'created_at', transformer: dateTransformer() })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', transformer: dateTransformer() })
  updatedAt: Date
}
