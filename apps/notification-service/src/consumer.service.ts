import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationService } from './notification.service';

export interface TaskCreatedEvent {
  taskId: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface TaskUpdatedEvent {
  taskId: string;
  userId: string;
  title: string;
  changes: Record<string, any>;
  updatedAt: string;
}

export interface TaskDeletedEvent {
  taskId: string;
  userId: string;
  deletedAt: string;
}

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private subscriber: Redis;

  constructor(private readonly notificationService: NotificationService) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    this.subscriber = new Redis(redisUrl);

    this.subscriber.on('connect', () => {
      console.log('[CONSUMER] Connected to Redis');
    });

    this.subscriber.on('error', (err) => {
      console.error('[CONSUMER] Redis error:', err.message);
    });

    // Subscribe to channels
    await this.subscriber.subscribe('task.created', 'task.updated', 'task.deleted');
    console.log('[CONSUMER] Subscribed to channels: task.created, task.updated, task.deleted');

    // Handle messages
    this.subscriber.on('message', async (channel: string, message: string) => {
      console.log('=========================================');
      console.log(`[CONSUMER] Received message on channel: ${channel}`);
      console.log(`[CONSUMER] Raw message: ${message}`);
      console.log('=========================================');

      try {
        const event = JSON.parse(message);
        await this.handleEvent(channel, event);
      } catch (error) {
        console.error('[CONSUMER] Failed to parse message:', error.message);
      }
    });
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
    console.log('[CONSUMER] Disconnected from Redis');
  }

  private async handleEvent(channel: string, event: any): Promise<void> {
    switch (channel) {
      case 'task.created':
        await this.handleTaskCreated(event as TaskCreatedEvent);
        break;
      case 'task.updated':
        await this.handleTaskUpdated(event as TaskUpdatedEvent);
        break;
      case 'task.deleted':
        await this.handleTaskDeleted(event as TaskDeletedEvent);
        break;
      default:
        console.log(`[CONSUMER] Unknown channel: ${channel}`);
    }
  }

  private async handleTaskCreated(event: TaskCreatedEvent): Promise<void> {
    console.log('=========================================');
    console.log('[EVENT] Task Created Event Received');
    console.log(`[EVENT] Task ID: ${event.taskId}`);
    console.log(`[EVENT] User: ${event.userName} (${event.userEmail})`);
    console.log(`[EVENT] Title: ${event.title}`);
    console.log('=========================================');

    // Send notification
    await this.notificationService.sendTaskCreatedNotification(event);
  }

  private async handleTaskUpdated(event: TaskUpdatedEvent): Promise<void> {
    console.log('=========================================');
    console.log('[EVENT] Task Updated Event Received');
    console.log(`[EVENT] Task ID: ${event.taskId}`);
    console.log(`[EVENT] Changes: ${JSON.stringify(event.changes)}`);
    console.log('=========================================');

    await this.notificationService.sendTaskUpdatedNotification(event);
  }

  private async handleTaskDeleted(event: TaskDeletedEvent): Promise<void> {
    console.log('=========================================');
    console.log('[EVENT] Task Deleted Event Received');
    console.log(`[EVENT] Task ID: ${event.taskId}`);
    console.log('=========================================');

    await this.notificationService.sendTaskDeletedNotification(event);
  }
}
