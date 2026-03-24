import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/current-user.decorator';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Public endpoint - Register a new user
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    console.log('[GATEWAY] POST /auth/register');

    const result = await this.authService.register(
      dto.email,
      dto.password,
      dto.name,
    );

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      message: result.message,
      user: result.user,
    };
  }

  /**
   * POST /auth/login
   * Public endpoint - Login and get JWT token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    console.log('[GATEWAY] POST /auth/login');

    const result = await this.authService.login(dto.email, dto.password);

    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }

    return {
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  /**
   * GET /auth/me
   * Protected endpoint - Get current user info
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@CurrentUser() user: any) {
    console.log('[GATEWAY] GET /auth/me');

    const userData = await this.authService.getUser(user.sub);

    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: userData,
    };
  }
}
