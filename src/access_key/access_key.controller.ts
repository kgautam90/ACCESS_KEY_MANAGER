import { Controller, Get } from '@nestjs/common';
import { AccessKeyService } from './access_key.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

interface AccessKeyRequest {
  userId?: string;
  timestamp?: number;
}

interface AccessKeyResponse {
  accessKey: string;
  timestamp: number;
}

@Controller('access-key')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}
  @Get()
  getAccessKey(): string {
    return this.accessKeyService.getAccessKey();
  }
  @MessagePattern({ cmd: 'get_access_key' })        
  handleAccessKey(@Payload() data: any): string {
    console.log('Received access key request:', data);
    return this.accessKeyService.getAccessKey();
  }
  @MessagePattern({ cmd: "sum" })
  calculateSum(data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }
}