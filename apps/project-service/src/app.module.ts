import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { EventBusService } from './event-bus.service';

// Proto path relative to workspace root
const PROTO_PATH = join(process.cwd(), 'libs/proto/src/lib/identity.proto');

@Module({
  imports: [
    // gRPC Client for Identity Service
    ClientsModule.register([
      {
        name: 'IDENTITY_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'identity',
          protoPath: PROTO_PATH,
          url: process.env.IDENTITY_SERVICE_URL || 'identity-service:5001',
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, EventBusService],
})
export class AppModule {}
