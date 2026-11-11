import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { FilterTasksDto } from './dto/filter-tasks.dto.js';
import { UpdateTasksDto } from './dto/update-tasks.dto.js';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @Get()
  // findAll(@Query('status') status?: string, @Query('id') id?: number) {
  //   return this.tasksService.findAll(status, id);
  // }

  // get request to find all tasks with optional query parameters for filtering
  @Get()
  findAll(@Query() queries: FilterTasksDto) {
    return this.tasksService.findAll(queries);
  }

  // get request to find a task by id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  // post request to create a new task
  @Post()
  createTask(@Body() payload: CreateTaskDto) {
    return this.tasksService.createTask(payload);
  }

  // delete request to remove a task by id
  @Delete(':id')
  removeTask(@Param('id') id: number) {
    return this.tasksService.removeTask(id);
  }

  @Patch(':id')
  updateTask(@Param('id') id: number, @Body() payload: UpdateTasksDto) {
    return this.tasksService.updateTask(id, payload);
  }
}
