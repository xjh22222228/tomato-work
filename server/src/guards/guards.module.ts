import { Module } from '@nestjs/common'
import { UserAuthGuard } from './user-auth.guard'

@Module({
  providers: [UserAuthGuard],
  exports: [UserAuthGuard],
})
export class GuardsModule {}
