import { Injectable } from '@nestjs/common';
import { Task } from './task.interface.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { FilterTasksDto } from './dto/filter-tasks.dto.js';
import { UpdateTasksDto } from './dto/update-tasks.dto.js';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'This is task 1',
      status: 'COMPLETED',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'This is task 2',
      status: 'COMPLETED',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'This is task 3',
      status: 'OPEN',
    },
  ];

  findAll(queries: FilterTasksDto) {
    const tasks = this.tasks;
    const { status, id, title } = queries;

    if (
      status === 'COMPLETED' ||
      status === 'IN_PROGRESS' ||
      status === 'OPEN'
    ) {
      if (status === 'COMPLETED') {
        return tasks.filter((task: any) => task.status === 'COMPLETED');
      } else if (status === 'IN_PROGRESS') {
        return tasks.filter((task: any) => task.status === 'IN_PROGRESS');
      } else if (status === 'OPEN') {
        return tasks.filter((task: any) => task.status === 'OPEN');
      }
    }

    if (id) {
      return tasks.filter((task: any) => task.id === id);
    }

    if (title) {
      return tasks.filter((task: any) => task.title === title);
    }

    return tasks;
  }

  createTask(payload: CreateTaskDto) {
    const newTask = {
      ...payload,
      id: this.tasks.length + 1,
      createdAt: new Date(),
    };

    this.tasks.push(newTask);

    return newTask;
  }

  findOne(id: number) {
    const expectedTask = this.tasks.find((task: any) => task.id === id);
    return expectedTask;
  }

  removeTask(id: number) {
    const filteredTasks = this.tasks.filter((task: any) => task.id !== id);
    this.tasks = filteredTasks;

    return {
      status: 'success',
      message: `Task with id ${id} has been removed successfully`,
      data: filteredTasks,
    };
  }

  updateTask(id: number, payload: UpdateTasksDto) {
    const taskIndex = this.tasks.findIndex((task: any) => task.id === id);
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...payload,
    };

    this.tasks[taskIndex] = updatedTask;

    return {
      status: 'success',
      message: `Task with id ${id} has been updated successfully`,
      data: updatedTask,
    }
  }
}
