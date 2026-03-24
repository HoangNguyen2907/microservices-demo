import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class IdentityService {
  // Simple hash function for demo (use bcrypt/argon2 in production)
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // In-memory user database with passwords
  private readonly users: User[] = [
    {
      id: '1',
      email: 'john@nexusflow.io',
      name: 'John Doe',
      passwordHash: this.hashPassword('password123'),
    },
    {
      id: '2',
      email: 'jane@nexusflow.io',
      name: 'Jane Smith',
      passwordHash: this.hashPassword('password123'),
    },
    {
      id: '3',
      email: 'bob@nexusflow.io',
      name: 'Bob Wilson',
      passwordHash: this.hashPassword('password123'),
    },
    {
      id: '4',
      email: 'alice@nexusflow.io',
      name: 'Alice Johnson',
      passwordHash: this.hashPassword('password123'),
    },
    {
      id: '5',
      email: 'charlie@nexusflow.io',
      name: 'Charlie Brown',
      passwordHash: this.hashPassword('password123'),
    },
  ];

  private nextId = 6;

  // ===========================================================================
  // User Management
  // ===========================================================================

  findById(userId: string): UserData | undefined {
    console.log(`[IDENTITY-SERVICE] Looking up user: ${userId}`);
    const user = this.users.find((u) => u.id === userId);

    if (user) {
      console.log(
        `[IDENTITY-SERVICE] Found user: ${user.name} (${user.email})`,
      );
      return { id: user.id, email: user.email, name: user.name };
    }

    console.log(`[IDENTITY-SERVICE] User not found: ${userId}`);
    return undefined;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  validateUser(userId: string): { valid: boolean; message: string } {
    const user = this.findById(userId);

    if (user) {
      return {
        valid: true,
        message: `User ${user.name} is valid`,
      };
    }

    return {
      valid: false,
      message: `User with ID ${userId} does not exist`,
    };
  }

  // ===========================================================================
  // Authentication
  // ===========================================================================

  register(
    email: string,
    password: string,
    name: string,
  ): { success: boolean; message: string; user?: UserData } {
    console.log(`[IDENTITY-SERVICE] Register attempt: ${email}`);

    // Check if email already exists
    const existing = this.findByEmail(email);
    if (existing) {
      console.log(`[IDENTITY-SERVICE] Registration failed: Email exists`);
      return {
        success: false,
        message: 'Email already registered',
      };
    }

    // Validate password (simple validation for demo)
    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters',
      };
    }

    // Create new user
    const newUser: User = {
      id: String(this.nextId++),
      email: email.toLowerCase(),
      name,
      passwordHash: this.hashPassword(password),
    };

    this.users.push(newUser);

    console.log(
      `[IDENTITY-SERVICE] User registered: ${newUser.name} (ID: ${newUser.id})`,
    );

    return {
      success: true,
      message: 'Registration successful',
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    };
  }

  login(
    email: string,
    password: string,
  ): { success: boolean; message: string; user?: UserData } {
    console.log(`[IDENTITY-SERVICE] Login attempt: ${email}`);

    const user = this.findByEmail(email);

    if (!user) {
      console.log(`[IDENTITY-SERVICE] Login failed: User not found`);
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const passwordHash = this.hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      console.log(`[IDENTITY-SERVICE] Login failed: Invalid password`);
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    console.log(`[IDENTITY-SERVICE] Login successful: ${user.name}`);

    return {
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  validateToken(userId: string): { valid: boolean; user?: UserData } {
    console.log(`[IDENTITY-SERVICE] Validating token for user: ${userId}`);

    const user = this.findById(userId);

    if (user) {
      return { valid: true, user };
    }

    return { valid: false };
  }
}
