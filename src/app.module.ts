import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService as NestConfigService} from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { AccessKeyModule } from './access_key/access_key.module';
import { TokenModule } from './token/token.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: 'SERVICE_ACCESS_KEY',
        imports: [ConfigModule],
        inject: [NestConfigService],
        useFactory: (configService: NestConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '::',
            port: parseInt(configService.get('ACCESS_KEY_PORT') ?? '3001'),
          },
        }),
      },
      {
        name: 'SERVICE_TOKEN',
        imports: [ConfigModule],
        inject: [NestConfigService],
        useFactory: (configService: NestConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '::',
            port: parseInt(configService.get('TOKEN_PORT') ?? '3002'),
          },
        }),
      },
    ]),
    UsersModule,
    AccessKeyModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}