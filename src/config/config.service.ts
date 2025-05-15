import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get databaseConfig() {
    return {
      dialect: this.configService.get('DB_DIALECT'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      autoLoadModels: true,
      synchronize: this.configService.get('NODE_ENV') === 'development',
    };
  }

  get jwtConfig() {
    return {
      staticToken: this.configService.get('JWT_STATIC_TOKEN'),
    };
  }
  get tokenConfig() {
    return {
      tokens: [
        {
          "chainId": 1,
          "address": "0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9",
          "name": "Wrapped Terra Classic",
          "symbol": "LUNC",
          "decimals": 18,
          "logoURI": "https://assets.coingecko.com/coins/images/13628/thumb/wluna.png?1696513376"
        },
        {
          "chainId": 1,
          "address": "0x5bb29c33c4a3c29f56f8aca40b4db91d8a5fe2c5",
          "name": "One Share",
          "symbol": "ONS",
          "decimals": 18,
          "logoURI": "https://assets.coingecko.com/coins/images/13531/thumb/bss.a1671c75.png?1696513292"
        }
      ]
    };
  }
} 