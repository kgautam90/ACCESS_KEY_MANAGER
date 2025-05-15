import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Connect to microservices
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    });
    
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    });

    await app.startAllMicroservices();
    await app.init();
  });

  afterAll(async () => {
    
  });

  it('/access-keys (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/access-keys')
      .expect(401); // Expecting 401 because the endpoint requires JWT authentication
    
    expect(response.body).toBeDefined();
  });
});
