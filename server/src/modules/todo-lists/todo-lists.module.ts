import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoListsService } from './todo-lists.service'
import { TodoListsController } from './todo-lists.controller'
import { TodoList } from './entities/todo-list.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TodoList])],
  controllers: [TodoListsController],
  providers: [TodoListsService],
  exports: [TodoListsService],
})
export class TodoListsModule {}
