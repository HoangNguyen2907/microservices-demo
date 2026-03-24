import { Injectable } from '@nestjs/common';
import { TaskCreatedEvent, TaskUpdatedEvent, TaskDeletedEvent } from './consumer.service';

export interface Notification {
  id: string;
  type: string;
  userId: string;
  message: string;
  metadata: Record<string, any>;
  createdAt: Date;
  read: boolean;
}

@Injectable()
export class NotificationService {
  // In-memory notification storage
  private notifications: Notification[] = [];
  private notificationIdCounter = 1;

  async sendTaskCreatedNotification(event: TaskCreatedEvent): Promise<void> {
    const notification: Notification = {
      id: String(this.notificationIdCounter++),
      type: 'TASK_CREATED',
      userId: event.userId,
      message: `New task created: "${event.title}"`,
      metadata: {
        taskId: event.taskId,
        title: event.title,
        description: event.description,
      },
      createdAt: new Date(),
      read: false,
    };

    this.notifications.push(notification);

    console.log('*****************************************');
    console.log('[NOTIFICATION] Task Created Notification');
    console.log('*****************************************');
    console.log(`  To: ${event.userName} (${event.userEmail})`);
    console.log(`  Subject: New Task Created`);
    console.log(`  Message: You have a new task: "${event.title}"`);
    console.log(`  Task ID: ${event.taskId}`);
    console.log('*****************************************');
    console.log('[NOTIFICATION] ✅ Notification sent successfully!');
    console.log('*****************************************');
  }

  async sendTaskUpdatedNotification(event: TaskUpdatedEvent): Promise<void> {
    const notification: Notification = {
      id: String(this.notificationIdCounter++),
      type: 'TASK_UPDATED',
      userId: event.userId,
      message: `Task updated: "${event.title}"`,
      metadata: {
        taskId: event.taskId,
        changes: event.changes,
      },
      createdAt: new Date(),
      read: false,
    };

    this.notifications.push(notification);

    console.log('*****************************************');
    console.log('[NOTIFICATION] Task Updated Notification');
    console.log('*****************************************');
    console.log(`  Task: ${event.title}`);
    console.log(`  Changes: ${JSON.stringify(event.changes)}`);
    console.log(`  Task ID: ${event.taskId}`);
    console.log('*****************************************');
    console.log('[NOTIFICATION] ✅ Notification sent successfully!');
    console.log('*****************************************');
  }

  async sendTaskDeletedNotification(event: TaskDeletedEvent): Promise<void> {
    const notification: Notification = {
      id: String(this.notificationIdCounter++),
      type: 'TASK_DELETED',
      userId: event.userId,
      message: `Task deleted`,
      metadata: {
        taskId: event.taskId,
      },
      createdAt: new Date(),
      read: false,
    };

    this.notifications.push(notification);

    console.log('*****************************************');
    console.log('[NOTIFICATION] Task Deleted Notification');
    console.log('*****************************************');
    console.log(`  Task ID: ${event.taskId}`);
    console.log('*****************************************');
    console.log('[NOTIFICATION] ✅ Notification sent successfully!');
    console.log('*****************************************');
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getNotificationsByUser(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }
}
