import { Module } from '@nestjs/common'
import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { BillsModule } from '../bills/bills.module'
import { TasksModule } from '../tasks/tasks.module'
import { TodoListsModule } from '../todo-lists/todo-lists.module'
import { RemindersModule } from '../reminders/reminders.module'
import { GuardsModule } from '@/guards/guards.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    BillsModule,
    TasksModule,
    TodoListsModule,
    RemindersModule,
    GuardsModule,
    UsersModule,
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
