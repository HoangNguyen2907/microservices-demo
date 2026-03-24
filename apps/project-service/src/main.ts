import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('=========================================');
  console.log('[PROJECT-SERVICE] REST API started');
  console.log(`[PROJECT-SERVICE] Listening on port ${port}`);
  console.log('[PROJECT-SERVICE] gRPC client → identity-service:5001');
  console.log('[PROJECT-SERVICE] Redis publisher → redis:6379');
  console.log('=========================================');
}

bootstrap();
