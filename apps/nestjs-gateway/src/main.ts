import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS - Allow all origins for demo
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log('='.repeat(60));
  console.log('[API-GATEWAY] NestJS API Gateway started');
  console.log(`[API-GATEWAY] Listening on port ${port}`);
  console.log(`[API-GATEWAY] Health check: http://localhost:${port}/health`);
  console.log('='.repeat(60));
  console.log('[API-GATEWAY] Available endpoints:');
  console.log('  POST /auth/register  - Register new user');
  console.log('  POST /auth/login     - Login and get JWT token');
  console.log('  GET  /auth/me        - Get current user (requires JWT)');
  console.log('  GET  /api/tasks      - List tasks (requires JWT)');
  console.log('  POST /api/tasks      - Create task (requires JWT)');
  console.log('  GET  /api/tasks/:id  - Get task (requires JWT)');
  console.log('  PUT  /api/tasks/:id  - Update task (requires JWT)');
  console.log('  DELETE /api/tasks/:id - Delete task (requires JWT)');
  console.log('='.repeat(60));
}

bootstrap();
