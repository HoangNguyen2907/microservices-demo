import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const PROJECT_SERVICE_URL =
  process.env.PROJECT_SERVICE_URL || 'http://localhost:3000';

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService) {}

  async createTask(data: { title: string; description?: string; userId: string }) {
    console.log(`[TASKS-SERVICE] Creating task for user: ${data.userId}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${PROJECT_SERVICE_URL}/tasks`, {
          title: data.title,
          description: data.description,
          userId: data.userId,
        }),
      );

      return response.data;
    } catch (error) {
      console.error('[TASKS-SERVICE] Error creating task:', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to create task',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTasks() {
    console.log('[TASKS-SERVICE] Getting all tasks');

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${PROJECT_SERVICE_URL}/tasks`),
      );

      return response.data;
    } catch (error) {
      console.error('[TASKS-SERVICE] Error getting tasks:', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to get tasks',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTask(id: string) {
    console.log(`[TASKS-SERVICE] Getting task: ${id}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${PROJECT_SERVICE_URL}/tasks/${id}`),
      );

      return response.data;
    } catch (error) {
      console.error('[TASKS-SERVICE] Error getting task:', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to get task',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTask(id: string, data: { title?: string; description?: string; completed?: boolean }) {
    console.log(`[TASKS-SERVICE] Updating task: ${id}`);

    try {
      const response = await firstValueFrom(
        this.httpService.put(`${PROJECT_SERVICE_URL}/tasks/${id}`, data),
      );

      return response.data;
    } catch (error) {
      console.error('[TASKS-SERVICE] Error updating task:', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to update task',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(id: string) {
    console.log(`[TASKS-SERVICE] Deleting task: ${id}`);

    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${PROJECT_SERVICE_URL}/tasks/${id}`),
      );

      return response.data;
    } catch (error) {
      console.error('[TASKS-SERVICE] Error deleting task:', error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to delete task',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
