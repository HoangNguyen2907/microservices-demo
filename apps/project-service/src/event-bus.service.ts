import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

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
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  private publisher: Redis;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    this.publisher = new Redis(redisUrl);

    this.publisher.on('connect', () => {
      console.log('[EVENT-BUS] Connected to Redis');
    });

    this.publisher.on('error', (err) => {
      console.error('[EVENT-BUS] Redis error:', err.message);
    });
  }

  async onModuleDestroy() {
    await this.publisher.quit();
    console.log('[EVENT-BUS] Disconnected from Redis');
  }

  async publish(channel: string, event: any): Promise<void> {
    const payload = JSON.stringify(event);
    console.log('=========================================');
    console.log(`[EVENT-BUS] Publishing to channel: ${channel}`);
    console.log(`[EVENT-BUS] Payload: ${payload}`);
    console.log('=========================================');

    await this.publisher.publish(channel, payload);
  }

  async publishTaskCreated(event: TaskCreatedEvent): Promise<void> {
    await this.publish('task.created', event);
  }

  async publishTaskUpdated(event: TaskUpdatedEvent): Promise<void> {
    await this.publish('task.updated', event);
  }

  async publishTaskDeleted(event: TaskDeletedEvent): Promise<void> {
    await this.publish('task.deleted', event);
  }
}
