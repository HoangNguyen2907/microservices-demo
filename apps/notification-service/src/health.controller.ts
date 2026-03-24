import { Controller, Get } from '@nestjs/common';
import { NotificationService, Notification } from './notification.service';

@Controller()
export class HealthController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('notifications')
  getNotifications(): Notification[] {
    return this.notificationService.getNotifications();
  }
}
