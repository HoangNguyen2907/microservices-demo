/**
 * Generated interfaces from identity.proto
 * These interfaces match the proto definitions exactly
 *
 * Proto field naming: snake_case (user_id)
 * TypeScript naming: snake_case (to match gRPC serialization)
 */

import { Observable } from 'rxjs';

// =============================================================================
// User Management Interfaces
// =============================================================================

export interface GetUserRequest {
  user_id: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  exists: boolean;
}

export interface ValidateUserRequest {
  user_id: string;
}

export interface ValidateUserResponse {
  valid: boolean;
  message: string;
}

// =============================================================================
// Authentication Interfaces
// =============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData;
}

export interface ValidateTokenRequest {
  user_id: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: UserData;
}

// =============================================================================
// gRPC Service Client Interface
// =============================================================================

export interface IdentityServiceClient {
  // User management
  getUser(data: GetUserRequest): Observable<UserResponse>;
  validateUser(data: ValidateUserRequest): Observable<ValidateUserResponse>;

  // Authentication
  register(data: RegisterRequest): Observable<AuthResponse>;
  login(data: LoginRequest): Observable<AuthResponse>;
  validateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse>;
}
