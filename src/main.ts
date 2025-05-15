import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create a hybrid application (HTTP + TCP)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Access Key Manager API')
    .setDescription('The Access Key Manager API documentation')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  
  // Configure TCP microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(configService.get('ACCESS_KEY_PORT') ?? '3001'),
    },
  });
 // Configure TCP microservice
 app.connectMicroservice({
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: parseInt(configService.get('TOKEN_PORT') ?? '3002'),
  },
});
  // Start all microservices
  await app.startAllMicroservices();
  
  // Start HTTP server
  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);
  console.log('Application is running on:', await app.getUrl());
  console.log('Swagger documentation is available at:', `${await app.getUrl()}/`);
  console.log('Access Key Microservice is running on port:', configService.get('ACCESS_KEY_PORT'));
  console.log('Token Microservice is running on port:', configService.get('TOKEN_PORT'));
}
bootstrap();
