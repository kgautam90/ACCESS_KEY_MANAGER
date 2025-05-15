import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeyService } from './access_key.service';
import { CustomLoggerService } from '../logger/logger.service';
import { getModelToken } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { RequestTrackerService } from './services/request-tracker.service';

describe('AccessKeyService', () => {
  let service: AccessKeyService;
  let logger: CustomLoggerService;
  let requestTracker: RequestTrackerService;

  const mockAccessKeyModel = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockUserModel = {
    findByPk: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const mockRequestTrackerService = {
    trackRequest: jest.fn(),
    getRequestCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessKeyService,
        {
          provide: getModelToken(AccessKey),
          useValue: mockAccessKeyModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: CustomLoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: RequestTrackerService,
          useValue: mockRequestTrackerService,
        },
      ],
    }).compile();

    service = module.get<AccessKeyService>(AccessKeyService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
    requestTracker = module.get<RequestTrackerService>(RequestTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccessKey', () => {
    it('should generate a new access key for a valid user', async () => {
      const accessKey = 'test-access-key';
      const userId = 'test-user';
      const rateLimit = 1000;
      const expiry = new Date();

      mockUserModel.findByPk.mockResolvedValue({ id: userId });
      mockAccessKeyModel.create.mockResolvedValue({
        accessKey,
        rateLimitPerMinute: rateLimit,
        expiryDate: expiry,
        status: 'active',
        userId,
      });

      const result = await service.getAccessKey(accessKey, userId, rateLimit, expiry);
      expect(result).toBe(accessKey);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId);
      expect(mockAccessKeyModel.create).toHaveBeenCalledWith({
        accessKey,
        rateLimitPerMinute: rateLimit,
        expiryDate: expiry,
        status: 'active',
        userId,
        usageCount: 0,
      });
    });
  });

  describe('validateAccessKey', () => {
    it('should validate an active access key', async () => {
      const accessKey = 'test-key';
      const mockAccessKey = {
        accessKey,
        status: 'active',
        expiryDate: new Date(Date.now() + 3600000), // 1 hour from now
        rateLimitPerMinute: 1000,
      };

      mockAccessKeyModel.findOne.mockResolvedValue(mockAccessKey);
      mockRequestTrackerService.getRequestCount.mockReturnValue(500);

      const result = await service.validateAccessKey(accessKey);
      expect(result).toBe(true);
      expect(mockRequestTrackerService.trackRequest).toHaveBeenCalledWith(accessKey);
    });

    it('should return false for inactive access key', async () => {
      const accessKey = 'test-key';
      const mockAccessKey = {
        accessKey,
        status: 'inactive',
        expiryDate: new Date(Date.now() + 3600000),
        rateLimitPerMinute: 1000,
      };

      mockAccessKeyModel.findOne.mockResolvedValue(mockAccessKey);

      const result = await service.validateAccessKey(accessKey);
      expect(result).toBe(false);
    });

    it('should return false for expired access key', async () => {
      const accessKey = 'test-key';
      const mockAccessKey = {
        accessKey,
        status: 'active',
        expiryDate: new Date(Date.now() - 3600000), // 1 hour ago
        rateLimitPerMinute: 1000,
      };

      mockAccessKeyModel.findOne.mockResolvedValue(mockAccessKey);

      const result = await service.validateAccessKey(accessKey);
      expect(result).toBe(false);
    });

    it('should return false when rate limit is exceeded', async () => {
      const accessKey = 'test-key';
      const mockAccessKey = {
        accessKey,
        status: 'active',
        expiryDate: new Date(Date.now() + 3600000),
        rateLimitPerMinute: 1000,
      };

      mockAccessKeyModel.findOne.mockResolvedValue(mockAccessKey);
      mockRequestTrackerService.getRequestCount.mockReturnValue(1500);

      const result = await service.validateAccessKey(accessKey);
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('getUserAccessKeys', () => {
    it('should return user access keys', async () => {
      const userId = 'test-user';
      const mockKeys = [
        {
          accessKey: 'key1',
          rateLimitPerMinute: 1000,
          expiryDate: new Date(),
          status: 'active',
        },
        {
          accessKey: 'key2',
          rateLimitPerMinute: 2000,
          expiryDate: new Date(),
          status: 'active',
        },
      ];

      mockAccessKeyModel.findAll.mockResolvedValue(mockKeys);

      const result = await service.getUserAccessKeys(userId);
      expect(result).toEqual(mockKeys);
      expect(mockAccessKeyModel.findAll).toHaveBeenCalledWith({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
    });
  });
});
