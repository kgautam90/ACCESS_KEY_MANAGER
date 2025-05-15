import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
export interface TokenAttribute {
    token: [{
        chainId: number;
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        logoURI: string;
    }]
  }
@Injectable()
export class TokenService {
  constructor(private readonly logger: CustomLoggerService, private readonly configService: ConfigService) {
    this.logger.log('TokenService initialized', 'TokenService');
  }

getToken(accessKey: string): TokenAttribute {
    this.logger.log('Generating token', 'TokenService');
    const tokens = this.configService.tokenConfig;
    return { token: tokens.tokens } as TokenAttribute;
  }
}
