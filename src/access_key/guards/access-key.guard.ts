import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AccessKeyService } from '../access_key.service';
import { CustomLoggerService } from '../../logger/logger.service';

@Injectable()
export class AccessKeyGuard implements CanActivate {
  constructor(
    private readonly accessKeyService: AccessKeyService,
    private readonly logger: CustomLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessKey = this.extractAccessKeyFromParam(request);

    if (!accessKey) {
      this.logger.warn('No access key provided', 'AccessKeyGuard');
      throw new UnauthorizedException('Access key is required');
    }

    try {
      // Validate access key and check rate limit
      const isValid = await this.accessKeyService.validateAccessKey(accessKey);
      
      if (!isValid) {
        this.logger.warn(`Invalid access key: ${accessKey}`, 'AccessKeyGuard');
        throw new UnauthorizedException('Invalid access key');
      }

      // Check rate limit
      const isRateLimitExceeded = await this.accessKeyService.checkRateLimit(accessKey);
      
      if (isRateLimitExceeded) {
        this.logger.warn(`Rate limit exceeded for access key: ${accessKey}`, 'AccessKeyGuard');
        throw new HttpException({
          status: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded'
        }, HttpStatus.TOO_MANY_REQUESTS);
      }

      // Add access key info to request for later use
      request.accessKey = accessKey;
      
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error validating access key: ${error.message}`, 'AccessKeyGuard');
      throw new UnauthorizedException('Error validating access key');
    }
  }

  private extractAccessKeyFromParam(request: any): string | undefined {
    //get access key from url param
    const accessKey = request.params.key;
    if (!accessKey) {
      return undefined;
    }
    return accessKey;
  }
} 