import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
   private readonly configService: ConfigService,
  ) {
    
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const staticToken = this.configService.jwtConfig.staticToken;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
     throw new UnauthorizedException('Invalid authorization type');
    }

    if (token !== staticToken) {
     throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
} 