import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { CustomLoggerService } from '../logger/logger.service';
import { Op } from 'sequelize';
import { RequestTrackerService } from './services/request-tracker.service';
import { UpdateAccessKeyDto } from './dto/update-access-key.dto';

@Injectable()
export class AccessKeyService {
  constructor(
    @InjectModel(AccessKey)
    private accessKeyModel: typeof AccessKey,
    @InjectModel(User)
    private userModel: typeof User,
    private readonly logger: CustomLoggerService,
    private readonly requestTracker: RequestTrackerService,
  ) {
    this.logger.log('AccessKeyService initialized', 'AccessKeyService');
  }

  async getAccessKey(accessKey: string, userId: string, rateLimit?: number, expiry?: Date): Promise<string> {
    try {
      // Validate user exists
      const user = await this.userModel.findByPk(userId);
      if (!user) {
        this.logger.warn(`User not found: ${userId}`, 'AccessKeyService');
        throw new BadRequestException('User not found');
      }
      // Validate expiry date
      if (expiry && expiry < new Date()) {
        throw new BadRequestException('Expiry date must be in the future');
      }

     
      // Save access key
      await this.accessKeyModel.create({
        accessKey: accessKey,
        rateLimitPerMinute: rateLimit || 1000, // Default rate limit
        expiryDate: expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        status: 'active',
        userId,
        usageCount: 0
      });

      this.logger.log(`Access key generated for user: ${userId}`, 'AccessKeyService');
      return accessKey;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error generating access key: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }
  async updateAccessKey(accessKey: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<string> {
    try {
      const key = await this.accessKeyModel.update(updateAccessKeyDto, {
        where: {
          accessKey,
          status: 'active', 
        },
      });
      return 'Access key updated successfully';
    } catch (error) {
      this.logger.error(`Error updating access key: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }
  async disableAccessKey(accessKey: string): Promise<boolean> {
    try {
      const key = await this.accessKeyModel.update({
        status: 'inactive',
      }, {
        where: {
          accessKey,
          status: 'active',
          expiryDate: {
            [Op.gt]: new Date(),
          },
        },
      });

      return !!key;
    } catch (error) {
      this.logger.error(`Error validating access key: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }

  async validateAccessKey(accessKey: string): Promise<boolean> {
    try {
      const key = await this.accessKeyModel.findOne({
        attributes: ['accessKey', 'rateLimitPerMinute'],
        where: {
          accessKey: accessKey,
          status: 'active',
          expiryDate: {
            [Op.gt]: new Date()
          }
        }
      });

      return !!key;
    } catch (error) {
      this.logger.error(`Error validating access key: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }

  async checkRateLimit(accessKey: string): Promise<boolean> {
    try {
      const key = await this.accessKeyModel.findOne({
        where: {
          accessKey: accessKey,
          status: 'active'
        }
      });

      if (!key) {
        return true; // Consider non-existent keys as rate limited
      }

      // Track this request
      this.requestTracker.trackRequest(accessKey);

      // Get the current request count for this access key
      const requestCount = this.requestTracker.getRequestCount(accessKey);

      // Check if the request count exceeds the rate limit
      if (requestCount > key.get('rateLimitPerMinute')) {
        this.logger.warn(
          `Rate limit exceeded for access key: ${accessKey}. Requests: ${requestCount}, Limit: ${key.get('rateLimitPerMinute')}`,
          'AccessKeyService'
        );
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Error checking rate limit: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }

  async getUserAccessKeys(accessKey: string): Promise<AccessKey[]> {
    try {
      return await this.accessKeyModel.findAll({
        where: { accessKey }
      });
    } catch (error) {
      this.logger.error(`Error getting user access keys: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }

  async getAccessKeys(): Promise<AccessKey[]> {
    try {
      const keys = await this.accessKeyModel.findAll();
      return keys;
    } catch (error) {
      this.logger.error(`Error getting user access keys: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }

  private generateAccessKey(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}`;
  }

  async deleteAccessKey(accessKey: string): Promise<boolean> {
    try {
      const result = await this.accessKeyModel.destroy({
        where: { accessKey }    
      });
      return !!result; 
    } catch (error) {
      this.logger.error(`Error deleting access key: ${error.message}`, 'AccessKeyService');
      throw error;
    }
  }
}
