import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { ConfigModule } from '@nestjs/config';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { getTokenDatabaseConfig } from '../config/database.config';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => ({
        ...getTokenDatabaseConfig(configService),
        models: [AccessKey, User],
      }),
    }),
    SequelizeModule.forFeature([AccessKey, User]),
  ],
  controllers: [TokenController],
  providers: [TokenService, CustomLoggerService, ConfigService],
  exports: [TokenService],
})
export class TokenModule {}
