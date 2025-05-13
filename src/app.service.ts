import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('SERVICE_ACCESS_KEY') private readonly clientA: ClientProxy,
    @Inject('SERVICE_TOKEN') private readonly clientB: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async calculateSum(numbers: number[]): Promise<number> {
    return this.clientA.send({ cmd: "sum" }, numbers).toPromise();
  }
}
