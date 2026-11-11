# The NestJS Handbook for Beginners – Build a Task Manager API

Nov 11, 2026&#32;

In this handbook, you'll learn NestJS by building a real project: a **Task Manager REST API**. You can create, read, update, filter and delete tasks with it.

We won't just memorize words like "Controller" or "Interceptor". First, you'll understand what each piece does and why it exists. Then you'll see how all pieces work together when a request hits your server. Finally, you'll write each piece yourself, step by step.

### What you'll build

By the end, your API will support these endpoints:

| Method | URL | What it does |
| --- | --- | --- |
| GET | /api/v1/tasks | Get all tasks (with optional filters) |
| GET | /api/v1/tasks/:id | Get one task by id |
| POST | /api/v1/tasks | Create a new task |
| PATCH | /api/v1/tasks/:id | Update part of a task |
| DELETE | /api/v1/tasks/:id | Delete a task |

### Prerequisites

You don't need to be an expert. But you should be comfortable with:

- Basic JavaScript (functions, arrays, objects, `async`/`await`)
- A little TypeScript (types, interfaces, classes)
- What an HTTP request is (GET, POST, and so on)
- Node.js 20 or newer installed on your computer

If you have used Express.js before, great. NestJS will feel familiar, because it runs on top of Express by default.

### Table of contents

1. What is NestJS?
2. NestJS fundamental concepts
3. How NestJS works: the life of a request
4. How to set up the Task Manager project
5. How to build the Task Manager step by step
   1. Step 1: The entry point (`main.ts`)
   2. Step 2: The root module
   3. Step 3: The Task model
   4. Step 4: The service
   5. Step 5: The controller
   6. Step 6: The feature module
   7. Step 7: DTOs and validation pipes
   8. Step 8: Middleware
   9. Step 9: Interceptors
   10. Step 10: Exception handling
   11. Step 11: Guards
6. How to test your API, and what to learn next

## 1. What is NestJS?

NestJS is a framework for building server-side applications with Node.js and TypeScript. It gives your backend a clear structure, so your code stays organized as the project grows.

### The problem NestJS solves

With plain Express, you can write a server in ten lines. That's great for small apps. But Express doesn't tell you *where* to put things. As the app grows, every team invents its own folder layout, and routes, database code and validation get mixed together.

NestJS fixes this by giving you a set of building blocks, each with one job:

- **Modules** group related code together.
- **Controllers** receive requests and send responses.
- **Services** hold your business logic.
- **Pipes, Guards, Middleware, Interceptors and Filters** handle the work around each request, like validation, security, logging and errors.

### An analogy: a restaurant

Think of your NestJS app as a restaurant:

| Restaurant | NestJS |
| --- | --- |
| The whole restaurant | The application |
| A section (kitchen, bar, bakery) | A **Module** |
| The waiter who takes your order | A **Controller** |
| The chef who cooks the food | A **Service** |
| The security guard at the door | A **Guard** |
| The receptionist who notes every visitor | **Middleware** |
| The person who checks your order is complete | A **Pipe** |
| The person who plates the food nicely | An **Interceptor** |
| The manager who handles complaints | An **Exception Filter** |

The waiter never cooks. The chef never talks to the customer. Each person does one job well. That's exactly how NestJS wants your code to work.

### Why learners like NestJS

- **TypeScript first.** You get autocomplete and catch mistakes before running your code.
- **Familiar structure.** If you know Angular or Spring, NestJS feels similar. If you don't, the structure is easy to learn.
- **Batteries included.** Official packages exist for databases, config, authentication, queues, caching and more.
- **Built on Express.** Under the hood, NestJS uses Express (or another HTTP adapter). So everything you know about HTTP still applies.

> A quick note on versions: this handbook uses **NestJS 12**. The project is written as an **ES module**, so relative imports end in `.js` (for example `./tasks.service.js`), even though the files are `.ts`. Don't worry, TypeScript handles this for you.

## 2. NestJS Fundamental Concepts

Before writing code, let's meet each building block. Read this section like a glossary. You'll see every concept again in real code in section 5.

One idea appears everywhere in NestJS: **decorators**. A decorator is a special function that starts with `@`, like `@Controller()` or `@Get()`. You put it above a class or method, and it tells NestJS what that class or method is for. Think of it as a sticky label.

### Module

A module is a box that groups related code. Every NestJS app has at least one module: the **root module** (`AppModule`). Bigger apps have one module per feature, like `TasksModule`, `UsersModule` or `AuthModule`.

```ts
@Module({
  imports: [],      // other modules this module needs
  controllers: [],  // controllers that belong to this module
  providers: [],    // services and other injectable classes
  exports: [],      // providers other modules may use
})
export class TasksModule {}
```

### Controller

A controller handles incoming requests and returns responses. It decides *which* code runs for *which* URL and HTTP method. A controller should stay thin: it reads the request and asks a service to do the real work.

```ts
@Controller('tasks')          // all routes start with /tasks
export class TasksController {
  @Get()                      // GET /tasks
  findAll() {
    return [];
  }
}
```

### Service (Provider)

A service holds your business logic: reading data, saving data, calculations and rules. In NestJS, a service is one kind of **provider**. A provider is any class marked with `@Injectable()` that NestJS can create and hand to other classes.

```ts
@Injectable()
export class TasksService {
  findAll() {
    return ['task 1', 'task 2'];
  }
}
```

### Dependency Injection (DI)

Dependency Injection means you don't create objects yourself with `new`. Instead, you *ask* for them in the constructor, and NestJS gives them to you.

```ts
@Controller('tasks')
export class TasksController {
  // NestJS sees this and passes in a TasksService for you
  constructor(private readonly tasksService: TasksService) {}
}
```

Why is this good? NestJS creates **one shared instance** of `TasksService` and reuses it. Your classes stay loosely connected, and in tests you can swap the real service for a fake one easily.

### DTO (Data Transfer Object)

A DTO is a class that describes the *shape* of data coming into your app, for example the body of a POST request. Combined with `class-validator` decorators, it also describes the *rules* the data must follow.

```ts
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
```

### Pipe

A pipe runs right before your controller method. It does two jobs:

- **Validation:** checks the incoming data. If the data is bad, it throws an error and the controller never runs.
- **Transformation:** converts data, for example the string `"5"` from the URL into the number `5`.

NestJS ships with built-in pipes like `ValidationPipe` and `ParseIntPipe`.

### Middleware

Middleware is a function that runs **first**, before NestJS even picks the route handler. It has access to the raw request and response. It's perfect for logging, adding headers or parsing cookies. It must call `next()` to pass the request along, just like Express middleware.

### Guard

A guard answers one yes-or-no question: **"Is this request allowed to continue?"** It returns `true` (let it pass) or `false` (block it with 403 Forbidden). Guards are used for authentication and authorization, such as checking for an API key or a user role.

### Interceptor

An interceptor wraps around your route handler. It can run code **before** the handler and **after** it. That makes it great for changing the response shape, measuring how long a request took, or caching.

### Exception Filter

When something throws an error, an exception filter catches it and turns it into a proper HTTP response. NestJS has a built-in filter, so if you throw `new NotFoundException()`, the client automatically gets a clean 404 JSON response. You can also write your own filters to customize error responses.

### Quick summary

| Concept | Decorator | One-line job |
| --- | --- | --- |
| Module | `@Module()` | Groups related code |
| Controller | `@Controller()` | Maps URLs to handler methods |
| Service | `@Injectable()` | Holds business logic |
| DTO | `class-validator` decorators | Describes and validates input data |
| Pipe | `@Injectable()` + `PipeTransform` | Validates and transforms input |
| Middleware | `@Injectable()` + `NestMiddleware` | Runs first, sees the raw request |
| Guard | `@Injectable()` + `CanActivate` | Allows or blocks a request |
| Interceptor | `@Injectable()` + `NestInterceptor` | Runs before and after the handler |
| Exception Filter | `@Catch()` + `ExceptionFilter` | Turns errors into HTTP responses |

## 3. How NestJS Works: The Life of a Request

Every request passes through the same fixed line of steps: **Middleware → Guards → Interceptors (before) → Pipes → Controller → Service → Interceptors (after) → Response**. If anything throws an error along the way, an **Exception Filter** catches it and sends an error response.

&#91;embedded content: NestJS request lifecycle · 9 steps, plus the error path\]

The request travels down through steps 1 to 9. The highlighted boxes, the controller and service, are where *your* business code lives. Everything else is a checkpoint around it. If any checkpoint throws an error, the dashed red path skips the rest and the exception filter answers instead.

### Following one request through the Task Manager

Let's follow a real request: a client sends `POST /api/v1/tasks` with this body:

```json
{ "title": "Learn NestJS", "description": "Read the handbook", "status": "OPEN" }
```

Here's what happens, step by step:

1. **The HTTP server receives it.** NestJS runs on Express. Express gets the raw request and hands it to NestJS.
2. **Middleware runs.** Our `RequestLoggerMiddleware` prints the method, URL and body to the console, then calls `next()`.
3. **Guards run.** A guard checks whether the request is allowed. (We'll add an API-key guard in Step 11.) If it says no, the client gets `403 Forbidden` and nothing else runs.
4. **Interceptors run their "before" part.** Our `ResponseFormatInterceptor` gets ready to wrap the response.
5. **Pipes run.** The global `ValidationPipe` checks the body against `CreateTaskDto`. If `title` is missing, the client gets `400 Bad Request` with a helpful message.
6. **The controller runs.** NestJS matches `POST /tasks` to `TasksController.createTask()`. The method receives the validated body.
7. **The service runs.** The controller calls `tasksService.createTask(payload)`. The service builds the new task and saves it in the list.
8. **Interceptors run their "after" part.** The interceptor takes the returned task and wraps it as `{ status, statusCode, data }`.
9. **The response goes back to the client** as JSON.

### How NestJS starts up (before any request)

The request flow above only works because NestJS did some setup first, when you ran `npm run dev`:

1. `main.ts` calls `NestFactory.create(AppModule)`.
2. NestJS reads `AppModule` and finds every imported module, like `TasksModule`.
3. For each module, it reads the `controllers` and `providers` lists.
4. It creates one instance of each provider (for example `TasksService`) and **injects** it into every class that asks for it.
5. It reads the `@Controller()` and `@Get()` / `@Post()` decorators and builds the route table.
6. Finally, `app.listen(4000)` starts the HTTP server and waits for requests.

&#91;embedded content: Task Manager structure · modules, providers and what connects them\]

`main.ts` creates the app from `AppModule`, which imports `TasksModule`. Inside it, NestJS injects `TasksService` into `TasksController`, the middleware runs before the controller, and the guard protects selected routes.

## 4. How to Set Up the Task Manager Project

You'll create the project with the Nest CLI, install two validation libraries, and start the dev server. This takes about five minutes.

### Step A: Create a new project

Open your terminal and run:

```bash
npx @nestjs/cli new task-manager
cd task-manager
```

The CLI asks which package manager you want. Pick `npm` if you're not sure.

### Step B: Install the validation libraries

We'll use `class-validator` and `class-transformer` to check incoming data:

```bash
npm install class-validator class-transformer
```

### Step C: Start the dev server

```bash
npm run dev
```

This runs `nest start --watch`. The server restarts every time you save a file. By the end of this handbook, it will listen on `http://localhost:4000`.

### Folder tour

Here's the folder layout we're going to build:

```text
task-manager/
├── src/
│   ├── main.ts                          # entry point: starts the app
│   ├── app.module.ts                    # root module
│   ├── common/                          # code shared by all features
│   │   ├── request-logger.middleware.ts
│   │   └── response-format.interceptor.ts
│   └── tasks/                           # the "tasks" feature
│       ├── dto/
│       │   ├── create-task.dto.ts
│       │   ├── filter-tasks.dto.ts
│       │   └── update-tasks.dto.ts
│       ├── task.interface.ts
│       ├── tasks.controller.ts
│       ├── tasks.module.ts
│       └── tasks.service.ts
├── package.json
├── nest-cli.json
└── tsconfig.json
```

Notice the pattern: **one folder per feature**. Everything about tasks lives in `src/tasks/`. Code that every feature shares lives in `src/common/`. When you later add users, you'll create `src/users/` with the same files.

### Useful CLI shortcuts

The Nest CLI can generate files for you, with the boilerplate already written:

```bash
npx nest generate module tasks       # creates tasks.module.ts
npx nest generate controller tasks   # creates tasks.controller.ts
npx nest generate service tasks      # creates tasks.service.ts
```

You can shorten `generate` to `g`, `module` to `mo`, `controller` to `co` and `service` to `s`. In this handbook we'll write the files by hand, so you see every line.

## 5. How to Build the Task Manager Step by Step

Now we build the app, one concept per step. After each step, save the file and check that the server still starts. Small steps make mistakes easy to find.

### Step 1: The entry point (`main.ts`)

`main.ts` is the first file that runs. Its job is to create the app and start the server.

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // 1. Create the app from the root module
  const app = await NestFactory.create(AppModule);

  // 2. Every route will start with /api/v1
  app.setGlobalPrefix('api/v1');

  // 3. Start listening for requests
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
```

Let's break it down:

- `NestFactory.create(AppModule)` builds the whole app, starting from the root module.
- `setGlobalPrefix('api/v1')` adds `/api/v1` in front of every route. So `/tasks` becomes `/api/v1/tasks`. Adding a version to your URLs is a good habit: later you can ship `/api/v2` without breaking old clients.
- `process.env.PORT ?? 4000` uses the `PORT` environment variable if it exists, otherwise port `4000`.

> **Why `.js` in the import?** This project is an ES module. In ES modules, Node.js needs the full file name. TypeScript compiles `app.module.ts` into `app.module.js`, so you write `.js` in the import.

We'll come back to `main.ts` in Steps 7 and 9 to add global pipes and interceptors.

### Step 2: The root module (`AppModule`)

The root module is the starting point NestJS reads to discover your whole app. For now, it simply imports the tasks feature.

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
```

Think of `AppModule` as the main door of the restaurant. It doesn't cook anything itself. It just says: "This restaurant has a tasks section." When you add a users feature, you'll add `UsersModule` to the `imports` array.

### Step 3: The Task model

Before writing logic, let's describe what a task looks like. A TypeScript **interface** is perfect for this.

```ts
// src/tasks/task.interface.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt?: Date;
}
```

- `status` can only be one of three exact strings. TypeScript will warn you if you type `'DONE'` by mistake.
- The `?` in `createdAt?` means this field is optional.

### Step 4: The service (`TasksService`)

The service is the chef: it does the real work. Our tasks live in a simple array in memory. (In a real app you'd use a database. You'll learn that later, and only the service will need to change.)

```ts
// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { Task } from './task.interface.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { FilterTasksDto } from './dto/filter-tasks.dto.js';
import { UpdateTasksDto } from './dto/update-tasks.dto.js';

@Injectable()
export class TasksService {
  // Our "database" for now: an array in memory
  private tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'This is task 1', status: 'COMPLETED' },
    { id: 2, title: 'Task 2', description: 'This is task 2', status: 'COMPLETED' },
    { id: 3, title: 'Task 3', description: 'This is task 3', status: 'OPEN' },
  ];

  findAll(queries: FilterTasksDto) {
    const { status, id, title } = queries;

    if (status) {
      return this.tasks.filter((task) => task.status === status);
    }
    if (id) {
      return this.tasks.filter((task) => task.id === id);
    }
    if (title) {
      return this.tasks.filter((task) => task.title === title);
    }
    return this.tasks;
  }

  findOne(id: number) {
    return this.tasks.find((task) => task.id === id);
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

  updateTask(id: number, payload: UpdateTasksDto) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = { ...this.tasks[taskIndex], ...payload };
    this.tasks[taskIndex] = updatedTask;

    return {
      status: 'success',
      message: `Task with id ${id} has been updated successfully`,
      data: updatedTask,
    };
  }

  removeTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return {
      status: 'success',
      message: `Task with id ${id} has been removed successfully`,
      data: this.tasks,
    };
  }
}
```

Here's what each method does:

| Method | What it does |
| --- | --- |
| `findAll(queries)` | Returns all tasks, or only the ones matching `status`, `id` or `title` |
| `findOne(id)` | Returns one task, or `undefined` if not found |
| `createTask(payload)` | Adds a new task with an `id` and `createdAt` date |
| `updateTask(id, payload)` | Merges new fields into an existing task |
| `removeTask(id)` | Removes a task and returns the remaining list |

Two important details:

- `@Injectable()` tells NestJS: "You can create this class and inject it into others." Without it, Dependency Injection won't work.
- `{ ...this.tasks[taskIndex], ...payload }` uses the **spread operator**. It copies the old task, then overwrites only the fields sent in `payload`. That's why PATCH can update just the title and keep everything else.

> **Note:** The original project checks each status with a long `if / else if` chain. `task.status === status` does the same job in one line, because the DTO in Step 7 already guarantees that `status` is a valid value.

> **Watch out:** `id: this.tasks.length + 1` has a hidden bug. Create 3 tasks, delete task 2, and create a new one: it gets id `3` again, a duplicate. A safer version is `id: Math.max(0, ...this.tasks.map((t) => t.id)) + 1`. Try fixing it yourself as a small exercise.

### Step 5: The controller (`TasksController`)

The controller is the waiter. It receives the request, picks out the data it needs, and passes it to the service. Notice that it contains almost no logic.

```ts
// src/tasks/tasks.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { FilterTasksDto } from './dto/filter-tasks.dto.js';
import { UpdateTasksDto } from './dto/update-tasks.dto.js';

@Controller('tasks')
export class TasksController {
  // Dependency Injection: NestJS gives us the TasksService
  constructor(private readonly tasksService: TasksService) {}

  // GET /api/v1/tasks?status=OPEN
  @Get()
  findAll(@Query() queries: FilterTasksDto) {
    return this.tasksService.findAll(queries);
  }

  // GET /api/v1/tasks/1
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  // POST /api/v1/tasks
  @Post()
  createTask(@Body() payload: CreateTaskDto) {
    return this.tasksService.createTask(payload);
  }

  // PATCH /api/v1/tasks/1
  @Patch(':id')
  updateTask(@Param('id') id: number, @Body() payload: UpdateTasksDto) {
    return this.tasksService.updateTask(id, payload);
  }

  // DELETE /api/v1/tasks/1
  @Delete(':id')
  removeTask(@Param('id') id: number) {
    return this.tasksService.removeTask(id);
  }
}
```

The decorators do most of the work here:

| Decorator | What it does | Example |
| --- | --- | --- |
| `@Controller('tasks')` | Sets the base path for all routes in this class | `/tasks` |
| `@Get()`, `@Post()`, `@Patch()`, `@Delete()` | Maps an HTTP method to the method below it | `@Get(':id')` matches `GET /tasks/5` |
| `@Param('id')` | Reads a value from the URL path | `5` from `/tasks/5` |
| `@Query()` | Reads the query string as an object | `{ status: 'OPEN' }` from `?status=OPEN` |
| `@Body()` | Reads the JSON body of the request | the new task data in a POST |

**What about the constructor?** `private readonly tasksService: TasksService` is Dependency Injection in action. You never write `new TasksService()`. NestJS looks at the type, finds the provider, and passes it in. `private readonly` is a TypeScript shortcut that also saves it as `this.tasksService`.

**What does the controller return?** Whatever the method returns, NestJS converts to JSON and sends back. Return an array, you get a JSON array. Return an object, you get a JSON object. NestJS also sets a sensible status code: `201 Created` for POST, `200 OK` for everything else.

### Step 6: The feature module (`TasksModule`)

We have a controller and a service. Now we put them in the same box, so NestJS knows they belong together.

```ts
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

- `controllers` lists the classes that handle routes.
- `providers` lists the classes NestJS can inject. Because `TasksService` is here, NestJS can give it to `TasksController`.

> **Common beginner error:** If you forget to add `TasksService` to `providers`, you'll see an error like *"Nest can't resolve dependencies of the TasksController"*. That message almost always means "you forgot to register a provider".

The app works now. Try it: open `http://localhost:4000/api/v1/tasks` in your browser and you'll see the three tasks.

### Step 7: DTOs and validation pipes

Right now, anyone can send *anything* to our API. A POST with no title? Accepted. A status of `"BANANA"`? Accepted. Let's fix that with **DTOs** and the **ValidationPipe**.

#### 7.1 The create DTO

This DTO says: "A new task must have a non-empty `title`, a non-empty `description`, and a `status` from our list."

```ts
// src/tasks/dto/create-task.dto.ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
  @IsNotEmpty()
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}
```

#### 7.2 The update DTO

For PATCH, every field is optional, because the client may update just one field.

```ts
// src/tasks/dto/update-tasks.dto.ts
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTasksDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}
```

#### 7.3 The filter DTO

DTOs work for query strings too. This one validates `?status=...`, `?id=...` and `?title=...`.

```ts
// src/tasks/dto/filter-tasks.dto.ts
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterTasksDto {
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;
}
```

#### 7.4 Turn on the ValidationPipe

DTOs alone do nothing. The `ValidationPipe` is what reads those decorators and checks the data. We turn it on **globally** in `main.ts`, so it protects every route:

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
```

Each option has a clear job:

| Option | What it does |
| --- | --- |
| `whitelist: true` | Strips any field that isn't in the DTO |
| `forbidNonWhitelisted: true` | Instead of stripping, rejects the request with an error |
| `transform: true` | Turns the plain JSON into an instance of your DTO class |
| `enableImplicitConversion: true` | Converts types automatically, like `"5"` from the URL into `5` |

That last option is why `@Param('id') id: number` works. URL values are always strings, but the pipe sees the `number` type and converts it.

Now send a bad request:

```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "", "status": "BANANA"}'
```

You'll get a `400 Bad Request` listing every problem, and your controller never runs:

```json
{
  "message": [
    "title should not be empty",
    "description should not be empty",
    "description must be a string",
    "status must be one of the following values: OPEN, IN_PROGRESS, COMPLETED"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

> **Tip:** For a single route, you can use a built-in pipe instead of implicit conversion: `@Param('id', ParseIntPipe) id: number`. It rejects `/tasks/abc` with a 400 error instead of passing `NaN` along.

### Step 8: Middleware (logging every request)

When something goes wrong, the first question is: "What request came in?" Let's log every request to the tasks routes.

#### 8.1 Write the middleware

```ts
// src/common/request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('req info :::', req.method, req.hostname, req.originalUrl, req.body);
    next(); // pass the request to the next step
  }
}
```

- `implements NestMiddleware` promises that this class has a `use()` method.
- `req`, `res` and `next` are the same objects you know from Express.
- **Always call `next()`.** If you forget, the request hangs forever and the client never gets a response.

#### 8.2 Apply it in the module

Middleware is not listed in `@Module()`. Instead, the module implements `NestModule` and registers it in a `configure()` method:

```ts
// src/tasks/tasks.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { RequestLoggerMiddleware } from '../common/request-logger.middleware.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes(TasksController);
  }
}
```

`forRoutes(TasksController)` means: "Run this middleware for every route in `TasksController`." You could also pass a path like `forRoutes('tasks')`.

Now call any tasks endpoint and watch your terminal:

```text
req info ::: GET localhost /api/v1/tasks?status=OPEN {}
```

### Step 9: Interceptors (a consistent response shape)

Frontend developers love APIs where every response looks the same. Let's wrap every successful response like this:

```json
{ "status": true, "statusCode": 200, "data": [ ... ] }
```

#### 9.1 Write the interceptor

```ts
// src/common/response-format.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Code here runs BEFORE the controller

    return next.handle().pipe(
      // Code inside map() runs AFTER the controller
      map((response) => {
        return {
          status: true,
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: response,
        };
      }),
    );
  }
}
```

This is the trickiest piece in the handbook, so let's go slowly:

- `context` gives you details about the current request. `context.switchToHttp().getResponse()` returns the Express response object, so we can read its `statusCode`.
- `next.handle()` runs the controller method. It returns an **Observable**, a stream that will deliver the controller's result.
- `.pipe(map(...))` changes that result before it's sent. Think of `map` here like `Array.map`: it takes a value and returns a new value.
- `response` is whatever the controller returned. We put it inside `data`.

#### 9.2 Apply it globally

Add it in `main.ts`, so every route gets the same shape:

```ts
// src/main.ts (add these lines)
import { ResponseFormatInterceptor } from './common/response-format.interceptor.js';

// inside bootstrap(), after setGlobalPrefix:
app.useGlobalInterceptors(new ResponseFormatInterceptor());
```

> **Middleware or interceptor?** Middleware only sees the request *before* routing. An interceptor sees both the request and the **result** of your handler. If you need to change the response, use an interceptor.

### Step 10: Exception handling

Try `GET /api/v1/tasks/999`. You get `200 OK` with empty data. That's wrong: the task doesn't exist, so the correct answer is `404 Not Found`.

#### 10.1 Throw built-in HTTP exceptions

NestJS has ready-made exceptions for common errors. Throw one from the service, and NestJS's built-in exception filter turns it into the right HTTP response.

```ts
// src/tasks/tasks.service.ts (updated methods)
import { Injectable, NotFoundException } from '@nestjs/common';

findOne(id: number) {
  const task = this.tasks.find((task) => task.id === id);
  if (!task) {
    throw new NotFoundException(`Task with id ${id} not found`);
  }
  return task;
}

updateTask(id: number, payload: UpdateTasksDto) {
  const task = this.findOne(id); // throws 404 if missing
  Object.assign(task, payload);
  return {
    status: 'success',
    message: `Task with id ${id} has been updated successfully`,
    data: task,
  };
}
```

Now `GET /api/v1/tasks/999` returns:

```json
{ "message": "Task with id 999 not found", "error": "Not Found", "statusCode": 404 }
```

The most useful built-in exceptions:

| Exception | Status code | When to use it |
| --- | --- | --- |
| `BadRequestException` | 400 | The input is wrong |
| `UnauthorizedException` | 401 | The user isn't logged in |
| `ForbiddenException` | 403 | The user isn't allowed to do this |
| `NotFoundException` | 404 | The thing doesn't exist |
| `ConflictException` | 409 | It already exists (for example, a duplicate title) |

#### 10.2 Write a custom exception filter

Notice a problem: success responses look like `{ status: true, statusCode, data }`, but errors look different. Interceptors don't run their "after" part when an error is thrown. An **exception filter** lets us shape errors too.

```ts
// src/common/http-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException) // only catch HTTP exceptions
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.getStatus();
    const body = exception.getResponse();

    response.status(statusCode).json({
      status: false,
      statusCode,
      error: body,
    });
  }
}
```

Register it globally in `main.ts`:

```ts
import { HttpExceptionFilter } from './common/http-exception.filter.js';

app.useGlobalFilters(new HttpExceptionFilter());
```

Now every error, including validation errors from Step 7, starts with `"status": false`. Your frontend can check one field to know if a request worked.

### Step 11: Guards (protecting routes)

Anyone can delete our tasks right now. Let's require a secret API key for creating, updating and deleting tasks. Reading stays public.

#### 11.1 Write the guard

```ts
// src/common/api-key.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    // true = let the request in, false = 403 Forbidden
    return apiKey === (process.env.API_KEY ?? 'my-secret-key');
  }
}
```

#### 11.2 Use the guard on routes

Use the `@UseGuards()` decorator on the methods you want to protect:

```ts
// src/tasks/tasks.controller.ts
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/api-key.guard.js';

@Post()
@UseGuards(ApiKeyGuard)
createTask(@Body() payload: CreateTaskDto) {
  return this.tasksService.createTask(payload);
}

@Delete(':id')
@UseGuards(ApiKeyGuard)
removeTask(@Param('id') id: number) {
  return this.tasksService.removeTask(id);
}
```

To protect every route in the controller at once, put `@UseGuards(ApiKeyGuard)` above `@Controller('tasks')` instead.

Test it:

```bash
# Without the key: 403 Forbidden
curl -X DELETE http://localhost:4000/api/v1/tasks/1

# With the key: works
curl -X DELETE http://localhost:4000/api/v1/tasks/1 -H "x-api-key: my-secret-key"
```

> **Security note:** The hard-coded fallback `'my-secret-key'` is only for learning. In a real app, always load secrets from environment variables (the `@nestjs/config` package helps), never commit them to Git, and use proper authentication such as JWT for real users.

### The final `main.ts`

Here's how `main.ts` looks with everything wired up:

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { ResponseFormatInterceptor } from './common/response-format.interceptor.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
```

## 6. How to Test Your API, and What to Learn Next

You can test the API by hand with `curl` (or Postman), and automatically with Vitest. Do both: manual tests help you explore, automatic tests stop old bugs from coming back.

### Manual testing with curl

```bash
# Get all tasks
curl http://localhost:4000/api/v1/tasks

# Filter by status
curl "http://localhost:4000/api/v1/tasks?status=OPEN"

# Get one task
curl http://localhost:4000/api/v1/tasks/1

# Create a task
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-key" \
  -d '{"title": "Learn NestJS", "description": "Read the handbook", "status": "OPEN"}'

# Update only the status
curl -X PATCH http://localhost:4000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-key" \
  -d '{"status": "IN_PROGRESS"}'
```

### Automatic testing with Vitest

This project uses **Vitest** for tests. Test files end in `.spec.ts`. Here's a unit test for the service:

```ts
// src/tasks/tasks.service.spec.ts
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    // Build a tiny NestJS module just for this test
    const moduleRef = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = moduleRef.get(TasksService);
  });

  it('returns only OPEN tasks when filtered', () => {
    const tasks = service.findAll({ status: 'OPEN' });
    expect(tasks.every((t) => t.status === 'OPEN')).toBe(true);
  });

  it('creates a new task', () => {
    const task = service.createTask({
      title: 'Write tests',
      description: 'Use Vitest',
      status: 'OPEN',
    });
    expect(task.title).toBe('Write tests');
    expect(service.findOne(task.id)).toEqual(task);
  });

  it('throws 404 for a missing task', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });
});
```

Run it with:

```bash
npm test
```

`Test.createTestingModule()` works like a real `@Module()`. When you need a fake dependency, register it with `{ provide: TasksService, useValue: { findAll: vi.fn() } }`. Note that mocks use `vi.fn()` in Vitest, not `jest.fn()`.

### What to learn next

You now know every core building block. Here's a good order for the next topics:

1. **Configuration:** move `PORT` and `API_KEY` into a `.env` file with `@nestjs/config`.
2. **A real database:** replace the in-memory array with PostgreSQL using `@nestjs/typeorm` or `@nestjs/drizzle`. Only the service changes, which proves why the service layer matters.
3. **Authentication:** replace the API-key guard with real user login (JWT) using the official NestJS authentication guide.
4. **API docs:** add `@nestjs/swagger` to get an interactive documentation page for free.
5. **Rate limiting:** add `@nestjs/throttler` to stop clients from sending too many requests.

The official documentation is the best next stop: [docs.nestjs.com](https://docs.nestjs.com).

### Practice exercises

- [ ] Fix the duplicate-id bug in `createTask` (see the tip in Step 4).
- [ ] Throw `NotFoundException` in `removeTask` when the task doesn't exist.
- [ ] Add a `GET /api/v1/tasks/stats` route that returns how many tasks have each status.
- [ ] Write an interceptor that logs how many milliseconds each request took.
- [ ] Make the filter in `findAll` combine `status` and `title` instead of using only the first one.

### Conclusion

In this handbook, you built a complete Task Manager REST API and met every core NestJS concept along the way. Modules organize your code, controllers handle routes, services hold your logic, and DTOs with pipes keep bad data out. Middleware, guards, interceptors and filters each handle one job around the request.

The most important idea to remember is the **request lifecycle**. When you know the order (middleware, guards, interceptors, pipes, controller, service, then back through interceptors), you always know where a new piece of code belongs.

Thanks for reading, and happy coding!
