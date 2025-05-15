import { Module } from '@nestjs/common';
import { AccessKeyController } from './access_key.controller';
import { AccessKeyService } from './access_key.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '../config/config.service';
import { RequestTrackerService } from './services/request-tracker.service';

@Module({
  imports: [
    LoggerModule,
    SequelizeModule.forFeature([AccessKey, User]),
    ConfigModule,
  ],
  controllers: [AccessKeyController],
  providers: [AccessKeyService, ConfigService, RequestTrackerService],
  exports: [AccessKeyService],
})
export class AccessKeyModule {}
