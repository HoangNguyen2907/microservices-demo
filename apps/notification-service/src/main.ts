import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('=========================================');
  console.log('[NOTIFICATION-SERVICE] Started');
  console.log(`[NOTIFICATION-SERVICE] Health endpoint on port ${port}`);
  console.log('[NOTIFICATION-SERVICE] Redis subscriber → redis:6379');
  console.log('[NOTIFICATION-SERVICE] Listening for events...');
  console.log('=========================================');
}

bootstrap();
