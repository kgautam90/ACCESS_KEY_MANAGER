import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessKeyModule } from './access_key/access_key.module';
import { TokenModule } from './token/token.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the main application
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  // Create the access key microservice
  const accessKeyApp = await NestFactory.createMicroservice(AccessKeyModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });
  await accessKeyApp.listen();

  // Create the token microservice
  const tokenApp = await NestFactory.createMicroservice(TokenModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });
  await tokenApp.listen();
}
bootstrap();
