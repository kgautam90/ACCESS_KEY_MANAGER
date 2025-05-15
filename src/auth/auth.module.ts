import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [ConfigModule],
  providers: [JwtAuthGuard, CustomLoggerService, ConfigService],
  exports: [JwtAuthGuard],
})
export class AuthModule {} 