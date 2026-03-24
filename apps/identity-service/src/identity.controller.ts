import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IdentityService } from './identity.service';

import {
    GetUserRequest,
    UserResponse,
    ValidateUserRequest,
    ValidateUserResponse,
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    ValidateTokenRequest,
    ValidateTokenResponse,
} from '@nexusflow/proto';

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  // ===========================================================================
  // User Management (Internal)
  // ===========================================================================

  @GrpcMethod('IdentityService', 'GetUser')
  getUser(data: GetUserRequest): UserResponse {
    console.log('=========================================');
    console.log('[GRPC] GetUser called');
    console.log(`[GRPC] Request: user_id = ${data.user_id}`);

    const user = this.identityService.findById(data.user_id);

    if (user) {
      console.log(`[GRPC] Response: User found - ${user.name}`);
      console.log('=========================================');
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        exists: true,
      };
    }

    console.log('[GRPC] Response: User not found');
    console.log('=========================================');
    return {
      id: '',
      email: '',
      name: '',
      exists: false,
    };
  }

  @GrpcMethod('IdentityService', 'ValidateUser')
  validateUser(data: ValidateUserRequest): ValidateUserResponse {
    console.log('=========================================');
    console.log('[GRPC] ValidateUser called');
    console.log(`[GRPC] Request: user_id = ${data.user_id}`);

    const result = this.identityService.validateUser(data.user_id);

    console.log(`[GRPC] Response: valid = ${result.valid}`);
    console.log('=========================================');

    return result;
  }

  // ===========================================================================
  // Authentication (Public via API Gateway)
  // ===========================================================================

  @GrpcMethod('IdentityService', 'Register')
  register(data: RegisterRequest): AuthResponse {
    console.log('=========================================');
    console.log('[GRPC] Register called');
    console.log(`[GRPC] Request: email = ${data.email}, name = ${data.name}`);

    const result = this.identityService.register(
      data.email,
      data.password,
      data.name,
    );

    console.log(`[GRPC] Response: success = ${result.success}`);
    console.log('=========================================');

    return {
      success: result.success,
      message: result.message,
      user: result.user,
    };
  }

  @GrpcMethod('IdentityService', 'Login')
  login(data: LoginRequest): AuthResponse {
    console.log('=========================================');
    console.log('[GRPC] Login called');
    console.log(`[GRPC] Request: email = ${data.email}`);

    const result = this.identityService.login(data.email, data.password);

    console.log(`[GRPC] Response: success = ${result.success}`);
    console.log('=========================================');

    return {
      success: result.success,
      message: result.message,
      user: result.user,
    };
  }

  @GrpcMethod('IdentityService', 'ValidateToken')
  validateToken(data: ValidateTokenRequest): ValidateTokenResponse {
    console.log('=========================================');
    console.log('[GRPC] ValidateToken called');
    console.log(`[GRPC] Request: user_id = ${data.user_id}`);

    const result = this.identityService.validateToken(data.user_id);

    console.log(`[GRPC] Response: valid = ${result.valid}`);
    console.log('=========================================');

    return {
      valid: result.valid,
      user: result.user,
    };
  }
}
