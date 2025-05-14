import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { CustomLoggerService } from '../logger/logger.service';
import { Op } from 'sequelize';

@Injectable()
export class AccessKeyService {
  constructor(
    @InjectModel(AccessKey)
    private readonly accessKeyModel: typeof AccessKey,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.log('AccessKeyService initialized', 'AccessKeyService');
  }

  async getAccessKey(userId?: string): Promise<string> {
    try {
      // Generate a simple access key
      const accessKey = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry

      // If userId is provided, associate the access key with the user
      if (userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
          throw new Error('User not found');
        }

        await this.accessKeyModel.create({
          accessKey,
          userId,
          rateLimitPerMinute: 60,
          expiryDate,
          status: 'active',
        });

        this.logger.debug(`Created access key for user ${userId}`, 'AccessKeyService');
      }

      return accessKey;
    } catch (error) {
      this.logger.error('Error generating access key', error.stack, 'AccessKeyService');
      throw error;
    }
  }

  async validateAccessKey(accessKey: string): Promise<boolean> {
    try {
      const key = await this.accessKeyModel.findOne({
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
      this.logger.error('Error validating access key', error.stack, 'AccessKeyService');
      throw error;
    }
  }

  async getUserAccessKeys(userId: string): Promise<AccessKey[]> {
    try {
      const accessKeys = await this.accessKeyModel.findAll({
        where: { userId },
        include: [User],
      });
      return accessKeys;
    } catch (error) {
      this.logger.error('Error fetching user access keys', error.stack, 'AccessKeyService');
      throw error;
    }
  }
}
