import { ConfigService } from '@nestjs/config';

export const getAccessKeyDatabaseConfig = (configService: ConfigService) => ({
  dialect: configService.get('DB_DIALECT'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  autoLoadModels: true,
  synchronize: configService.get('NODE_ENV') === 'development',
  name: 'access_key_connection', // Unique connection name
  logging: configService.get('NODE_ENV') === 'development',
});

export const getTokenDatabaseConfig = (configService: ConfigService) => ({
  dialect: configService.get('DB_DIALECT'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  autoLoadModels: true,
  synchronize: configService.get('NODE_ENV') === 'development',
  name: 'token_connection', // Unique connection name
  logging: configService.get('NODE_ENV') === 'development',
}); 