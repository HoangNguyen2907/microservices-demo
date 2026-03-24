import { Injectable, Inject, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService, TaskCreatedEvent } from './event-bus.service';

// Import shared gRPC interfaces from proto
import { IdentityServiceClient, UserResponse } from '@nexusflow/proto';

// Task interfaces
export interface Task {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  userId: string;
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

@Injectable()
export class ProjectService implements OnModuleInit {
  private identityService: IdentityServiceClient;

  // In-memory task storage
  private tasks: Task[] = [];

  constructor(
    @Inject('IDENTITY_SERVICE') private readonly client: ClientGrpc,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit() {
    this.identityService = this.client.getService<IdentityServiceClient>('IdentityService');
    console.log('[PROJECT-SERVICE] gRPC client initialized');
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    console.log('=========================================');
    console.log('[PROJECT-SERVICE] Creating task...');
    console.log(`[PROJECT-SERVICE] User ID: ${dto.userId}`);
    console.log(`[PROJECT-SERVICE] Title: ${dto.title}`);
    console.log('=========================================');

    // Step 1: Call identity-service via gRPC to validate user
    console.log('[PROJECT-SERVICE] Step 1: Calling identity-service via gRPC...');

    let userResponse: UserResponse;
    try {
      userResponse = await firstValueFrom(
        this.identityService.getUser({ user_id: dto.userId }),
      );
    } catch (error) {
      console.error('[PROJECT-SERVICE] gRPC call failed:', error.message);
      throw new BadRequestException('Failed to connect to identity service');
    }

    console.log('[PROJECT-SERVICE] gRPC response received');
    console.log(`[PROJECT-SERVICE] User exists: ${userResponse.exists}`);

    // Step 2: Validate user exists
    if (!userResponse.exists) {
      console.log('[PROJECT-SERVICE] User validation failed - user not found');
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    console.log(`[PROJECT-SERVICE] Step 2: User validated - ${userResponse.name}`);

    // Step 3: Create task
    const task: Task = {
      id: uuidv4(),
      userId: dto.userId,
      userName: userResponse.name,
      title: dto.title,
      description: dto.description || '',
      status: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(task);
    console.log(`[PROJECT-SERVICE] Step 3: Task created with ID: ${task.id}`);

    // Step 4: Publish event to Redis
    console.log('[PROJECT-SERVICE] Step 4: Publishing event to Redis...');

    const event: TaskCreatedEvent = {
      taskId: task.id,
      userId: userResponse.id,
      userName: userResponse.name,
      userEmail: userResponse.email,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt.toISOString(),
    };

    await this.eventBus.publishTaskCreated(event);

    console.log('[PROJECT-SERVICE] Task creation completed successfully');
    console.log('=========================================');

    return task;
  }

  async findAll(): Promise<Task[]> {
    console.log(`[PROJECT-SERVICE] Fetching all tasks (${this.tasks.length} total)`);
    return this.tasks;
  }

  async findById(id: string): Promise<Task> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const task = this.tasks[taskIndex];
    const updatedTask = {
      ...task,
      ...dto,
      updatedAt: new Date(),
    };

    this.tasks[taskIndex] = updatedTask;

    // Publish update event
    await this.eventBus.publishTaskUpdated({
      taskId: id,
      userId: task.userId,
      title: updatedTask.title,
      changes: dto,
      updatedAt: updatedTask.updatedAt.toISOString(),
    });

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);

    // Publish delete event
    await this.eventBus.publishTaskDeleted({
      taskId: id,
      userId: task.userId,
      deletedAt: new Date().toISOString(),
    });
  }
}
