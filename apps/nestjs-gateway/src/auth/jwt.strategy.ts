import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    console.log(`[JWT-STRATEGY] Validating token for user: ${payload.sub}`);

    // Optional: Validate user still exists in identity service
    const result = await this.authService.validateToken(payload.sub);

    if (!result.valid) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return user info to be attached to request
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
