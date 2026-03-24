import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { HealthController } from './health.controller';

// gRPC Client configuration
const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || 'localhost:5001';
const PROJECT_SERVICE_URL =
  process.env.PROJECT_SERVICE_URL || 'localhost:3000';

// Proto path relative to workspace root
const PROTO_PATH = join(process.cwd(), 'libs/proto/src/lib/identity.proto');

@Module({
  imports: [
    // Passport for JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT configuration
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      signOptions: { expiresIn: '1h' },
    }),

    // gRPC clients
    ClientsModule.register([
      {
        name: 'IDENTITY_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'identity',
          protoPath: PROTO_PATH,
          url: IDENTITY_SERVICE_URL,
        },
      },
    ]),

    // Feature modules
    AuthModule,
    TasksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
