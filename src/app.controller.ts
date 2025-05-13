import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('SERVICE_ACCESS_KEY') private readonly clientA: ClientProxy,
    @Inject('SERVICE_TOKEN') private readonly clientB: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('access-key')
  async getAccessKey(): Promise<string> {
    try {
      const result = await this.clientA.send({ cmd: 'get_access_key' }, 'Gautam').toPromise();
      return result;
    } catch (error) {
      console.error('Error getting access key:', error);
      throw error;
    }
  }

  @Get('token')
  async getToken(): Promise<string> {
    try {
      const result = await this.clientB.send({ cmd: 'token' }, { userId: 'some-id' }).toPromise();
      return result;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  @Get("sum")
  async getSum(): Promise<number> {
    return this.appService.calculateSum([5, 10, 15]);
  }
}
