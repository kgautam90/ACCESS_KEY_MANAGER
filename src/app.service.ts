import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CustomLoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('SERVICE_ACCESS_KEY') private readonly clientA: ClientProxy,
    @Inject('SERVICE_TOKEN') private readonly clientB: ClientProxy,
    private readonly logger: CustomLoggerService
  ) {
    this.logger.log('AppService initialized', 'AppService');
  }

  getHello(): string {
    this.logger.log('Hello endpoint called', 'AppService');
    return 'Hello World!';
  }

  async calculateSum(numbers: number[]): Promise<number> {
    return this.clientA.send({ cmd: "sum" }, numbers).toPromise();
  }

  simulateError(): void {
    try {
      throw new Error('This is a simulated error');
    } catch (error) {
      this.logger.error(
        'An error occurred',
        error.stack,
        'AppService',
      );
    }
  }

  simulateWarning(): void {
    this.logger.warn('This is a warning message', 'AppService');
  }

  simulateDebug(): void {
    this.logger.debug('This is a debug message', 'AppService');
  }
}
