import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Controller('api/tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * POST /api/tasks
   * Create a new task (authenticated)
   */
  @Post()
  async createTask(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    console.log(`[GATEWAY] POST /api/tasks by user: ${user.sub}`);

    return this.tasksService.createTask({
      title: dto.title,
      description: dto.description,
      userId: user.sub,
    });
  }

  /**
   * GET /api/tasks
   * Get all tasks (authenticated)
   */
  @Get()
  async getTasks(@CurrentUser() user: any) {
    console.log(`[GATEWAY] GET /api/tasks by user: ${user.sub}`);

    return this.tasksService.getTasks();
  }

  /**
   * GET /api/tasks/:id
   * Get a specific task (authenticated)
   */
  @Get(':id')
  async getTask(@Param('id') id: string, @CurrentUser() user: any) {
    console.log(`[GATEWAY] GET /api/tasks/${id} by user: ${user.sub}`);

    return this.tasksService.getTask(id);
  }

  /**
   * PUT /api/tasks/:id
   * Update a task (authenticated)
   */
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    console.log(`[GATEWAY] PUT /api/tasks/${id} by user: ${user.sub}`);

    return this.tasksService.updateTask(id, dto);
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task (authenticated)
   */
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @CurrentUser() user: any) {
    console.log(`[GATEWAY] DELETE /api/tasks/${id} by user: ${user.sub}`);

    return this.tasksService.deleteTask(id);
  }
}
