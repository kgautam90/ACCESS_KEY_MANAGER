import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE_ACCESS_KEY',
        transport: Transport.TCP,
        options: {
          host: '::',
          port: 3001,
        },
      },
      {
        name: 'SERVICE_TOKEN',
        transport: Transport.TCP,
        options: {
          host: '::',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}