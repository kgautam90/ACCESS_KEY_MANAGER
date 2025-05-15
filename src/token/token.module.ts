import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
  ],
  controllers: [TokenController],
  providers: [TokenService, ConfigService],
  exports: [TokenService]
})
export class TokenModule {}
