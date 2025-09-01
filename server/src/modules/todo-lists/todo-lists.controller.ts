import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { UserAuthGuard } from '@/guards/user-auth.guard'
import { User } from '@/decorators/user.decorator'
import { TodoListsService } from './todo-lists.service'
import { CreateTodoListDto } from './dto/create-todo-list.dto'
import { UpdateTodoListDto } from './dto/update-todo-list.dto'
import { GetTodoListDto } from './dto/get-todo-list.dto'

@Controller('todo-list')
@UseGuards(UserAuthGuard)
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Post('add')
  create(@User() user, @Body() createTodoListDto: CreateTodoListDto) {
    return this.todoListsService.create(user.uid, createTodoListDto)
  }

  @Post('getAll')
  findAll(@User() user, @Body() getTodoListDto: GetTodoListDto) {
    return this.todoListsService.findAll(user.uid, getTodoListDto)
  }

  @Get(':id')
  findOne(@User() user, @Param('id') id: string) {
    return this.todoListsService.findOne(id, user.uid)
  }

  @Post('update')
  update(@User() user, @Body() updateTodoListDto: UpdateTodoListDto) {
    return this.todoListsService.update(user.uid, updateTodoListDto)
  }

  @Post('delete')
  remove(@User() user, @Body('id') id: string) {
    return this.todoListsService.remove(id, user.uid)
  }
}
