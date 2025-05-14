import { Module } from '@nestjs/common';
import { AccessKeyController } from './access_key.controller';
import { AccessKeyService } from './access_key.service';
import { LoggerModule } from '../logger/logger.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    SequelizeModule.forFeature([AccessKey, User])
  ],
  controllers: [AccessKeyController],
  providers: [AccessKeyService],
  exports: [AccessKeyService]
})
export class AccessKeyModule {}
