import { Controller, BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessKeyService } from './access_key.service';
import { CustomLoggerService } from '../logger/logger.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { UpdateAccessKeyDto } from './dto/update-access-key.dto';

@Controller()
export class AccessKeyController {
  constructor(
    private readonly accessKeyService: AccessKeyService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.log('AccessKeyController initialized', 'AccessKeyController');
  }

  @MessagePattern({ cmd: 'generate_access_key' })
  async handleGenerateAccessKey(@Payload() data: CreateAccessKeyDto): Promise<string> {
    try {
      this.logger.log(
        `Received generate access key request for user: ${data.userId}`,
        'AccessKeyController'
      );
      return await this.accessKeyService.getAccessKey(data.accessKey||'', data.userId, data.rateLimit, data.expiry);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request: ${error.message}`, 'AccessKeyController');
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        });
      }
      this.logger.error(`Error generating access key: ${error.message}`, 'AccessKeyController');
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'Bad Request'
      });
    }
  }
  @MessagePattern({ cmd: 'update_access_key' })
  async handleUpdateAccessKey(@Payload() data: {accessKey: string, updateAccessKeyDto: UpdateAccessKeyDto}): Promise<string> {
    try {
      this.logger.log(
        `Received generate access key request for AccessKey: ${data.accessKey}`,
        'AccessKeyController'
      );
      return await this.accessKeyService.updateAccessKey(data.accessKey||'', data.updateAccessKeyDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request: ${error.message}`, 'AccessKeyController');
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        });
      }
      this.logger.error(`Error generating access key: ${error.message}`, 'AccessKeyController');
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'Bad Request'
      });
    }
  }
  @MessagePattern({ cmd: 'disable_access_key' })
  async handleValidateAccessKey(@Payload() data: { accessKey: string }): Promise<boolean> {
    try {
      if (!data.accessKey) {
        throw new BadRequestException('Access key is required');
      }
      this.logger.log(
        `Received disable access key request for key: ${data.accessKey}`,
        'AccessKeyController'
      );
      return await this.accessKeyService.disableAccessKey(data.accessKey);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request: ${error.message}`, 'AccessKeyController');
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        });
      }
      this.logger.error(`Error validating access key: ${error.message}`, 'AccessKeyController');
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_user_access_keys' })
  async handleGetUserAccessKeys(@Payload() data: { accessKey: string }): Promise<any> {
    try {
        console.log(data);
      if (!data.accessKey) {
        throw new BadRequestException('Access key is required');
      }
      this.logger.log(
        `Received get user access keys request for user: ${data.accessKey}`,
        'AccessKeyController'
      );
      return await this.accessKeyService.getUserAccessKeys(data.accessKey);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request: ${error.message}`, 'AccessKeyController');
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        });
      }
      this.logger.error(`Error getting user access keys: ${error.message}`, 'AccessKeyController');
      throw error;
    }
  }
  @MessagePattern({ cmd: 'get_access_keys' })
  async handleGetAccessKeys(): Promise<any> {
    try {
      return await this.accessKeyService.getAccessKeys();
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request: ${error.message}`, 'AccessKeyController');
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        });
      }
      this.logger.error(`Error getting user access keys: ${error.message}`, 'AccessKeyController');
      throw error;
    }
  }
  @MessagePattern({ cmd: 'delete_access_key' })
  async handleDeleteAccessKey(@Payload() data: { accessKey: string }): Promise<boolean> {
    try {
      if (!data.accessKey) {
        throw new BadRequestException('Access key is required');
      }
      this.logger.log(
        `Received delete access key request for key: ${data.accessKey}`,
        'AccessKeyController'
      );
      return await this.accessKeyService.deleteAccessKey(data.accessKey);
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Bad request: ${error.message}`, 'AccessKeyController');
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        });
      }
      this.logger.error(`Error deleting access key: ${error.message}`, 'AccessKeyController');
      throw error;
    }
  }
}   