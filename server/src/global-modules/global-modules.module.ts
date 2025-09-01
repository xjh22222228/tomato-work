import { Module, Global } from '@nestjs/common'
import { UsersModule } from '../modules/users/users.module'
import { GuardsModule } from '../guards/guards.module'

@Global()
@Module({
  imports: [UsersModule, GuardsModule],
  exports: [UsersModule, GuardsModule],
})
export class GlobalModulesModule {}
