import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { NotificationService } from './notification.service';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [ConsumerService, NotificationService],
})
export class AppModule {}
