import { Module } from '@nestjs/common';
import { AccessKeyController } from './access_key.controller';
import { AccessKeyService } from './access_key.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAccessKeyDatabaseConfig } from '../config/database.config';
import { CustomLoggerService } from '../logger/logger.service';
import { RequestTrackerService } from './services/request-tracker.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...getAccessKeyDatabaseConfig(configService),
        models: [AccessKey, User],
      }),
    }),
    SequelizeModule.forFeature([AccessKey, User]),
  ],
  controllers: [AccessKeyController],
  providers: [AccessKeyService, CustomLoggerService, RequestTrackerService],
  exports: [AccessKeyService],
})
export class AccessKeyModule {}
