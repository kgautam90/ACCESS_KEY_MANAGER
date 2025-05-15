import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from '../logger/logger.module';
import { User } from '../models/user.model';
import { AccessKey } from '../models/access_key.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    LoggerModule,
    SequelizeModule.forFeature([User, AccessKey]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
  exports: [UsersService]
})
export class UsersModule {} 