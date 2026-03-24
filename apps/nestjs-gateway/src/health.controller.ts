import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'nestjs-gateway',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  root() {
    return {
      service: 'NexusFlow API Gateway',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          me: 'GET /auth/me',
        },
        tasks: {
          list: 'GET /api/tasks',
          create: 'POST /api/tasks',
          get: 'GET /api/tasks/:id',
          update: 'PUT /api/tasks/:id',
          delete: 'DELETE /api/tasks/:id',
        },
        health: 'GET /health',
      },
    };
  }
}
