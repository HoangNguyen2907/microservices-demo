import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || 'localhost:5001';

// Proto path relative to workspace root
const PROTO_PATH = join(process.cwd(), 'libs/proto/src/lib/identity.proto');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
