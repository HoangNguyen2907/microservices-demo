import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { IdentityServiceClient } from '@nexusflow/proto';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  name: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable()
export class AuthService implements OnModuleInit {
  private identityService: IdentityServiceClient;

  constructor(
    @Inject('IDENTITY_SERVICE') private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.identityService =
      this.client.getService<IdentityServiceClient>('IdentityService');
    console.log('[AUTH-SERVICE] Connected to Identity Service via gRPC');
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResult> {
    console.log(`[AUTH-SERVICE] Register request: ${email}`);

    const result = await firstValueFrom(
      this.identityService.register({ email, password, name }),
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
      user: result.user,
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    console.log(`[AUTH-SERVICE] Login request: ${email}`);

    const result = await firstValueFrom(
      this.identityService.login({ email, password }),
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    const payload: JwtPayload = {
      sub: result.user!.id,
      email: result.user!.email,
      name: result.user!.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: result.message,
      accessToken,
      user: result.user,
    };
  }

  async validateToken(userId: string) {
    console.log(`[AUTH-SERVICE] Validate token for user: ${userId}`);

    const result = await firstValueFrom(
      this.identityService.validateToken({ user_id: userId }),
    );

    return result;
  }

  async getUser(userId: string) {
    const result = await firstValueFrom(
      this.identityService.getUser({ user_id: userId }),
    );

    if (!result.exists) {
      return null;
    }

    return {
      id: result.id,
      email: result.email,
      name: result.name,
    };
  }
}
