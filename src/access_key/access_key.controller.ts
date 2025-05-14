import { Controller, Get } from '@nestjs/common';
import { AccessKeyService } from './access_key.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomLoggerService } from '../logger/logger.service';

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
  constructor(
    private readonly accessKeyService: AccessKeyService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.log('AccessKeyController initialized', 'AccessKeyController');
  }

  @Get()
  async getAccessKey(): Promise<string> {
    this.logger.log('GET /access-key endpoint called', 'AccessKeyController');
    const accessKey = await this.accessKeyService.getAccessKey();
    this.logger.debug(`Generated access key: ${accessKey}`, 'AccessKeyController');
    return accessKey;
  }

  @MessagePattern({ cmd: 'get_access_key' })        
  async handleAccessKey(@Payload() data: AccessKeyRequest): Promise<string> {
    this.logger.log(
      `Received access key request for user: ${data.userId || 'unknown'}`,
      'AccessKeyController'
    );
    
    try {
      const accessKey = await this.accessKeyService.getAccessKey(data.userId);
      this.logger.debug(
        `Generated access key for user ${data.userId || 'unknown'}: ${accessKey}`,
        'AccessKeyController'
      );
      return accessKey;
    } catch (error) {
      this.logger.error(
        `Failed to generate access key for user ${data.userId || 'unknown'}`,
        error.stack,
        'AccessKeyController'
      );
      throw error;
    }
  }

}