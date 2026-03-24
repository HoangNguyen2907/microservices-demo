import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService, CreateTaskDto, UpdateTaskDto, Task } from './project.service';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'project-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('tasks')
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    console.log('=========================================');
    console.log('[API] POST /tasks');
    console.log('[API] Request body:', JSON.stringify(dto));
    console.log('=========================================');

    const task = await this.projectService.createTask(dto);

    console.log('[API] Response:', JSON.stringify(task, null, 2));
    return task;
  }

  @Get('tasks')
  async findAllTasks(): Promise<Task[]> {
    console.log('[API] GET /tasks');
    return this.projectService.findAll();
  }

  @Get('tasks/:id')
  async findTaskById(@Param('id') id: string): Promise<Task> {
    console.log(`[API] GET /tasks/${id}`);
    return this.projectService.findById(id);
  }

  @Put('tasks/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    console.log(`[API] PUT /tasks/${id}`);
    console.log('[API] Request body:', JSON.stringify(dto));
    return this.projectService.updateTask(id, dto);
  }

  @Delete('tasks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string): Promise<void> {
    console.log(`[API] DELETE /tasks/${id}`);
    return this.projectService.deleteTask(id);
  }
}
