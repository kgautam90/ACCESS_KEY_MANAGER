import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class TokenService {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.log('TokenService initialized', 'TokenService');
  }

  getToken(): string {
    this.logger.log('Generating token', 'TokenService');
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.debug(`Generated token: ${token}`, 'TokenService');
    return token;
  }
}
