import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeyController } from './access_key.controller';
import { AccessKeyService } from './access_key.service';
import { CustomLoggerService } from '../logger/logger.service';
import { getModelToken } from '@nestjs/sequelize';
import { AccessKey } from '../models/access_key.model';
import { User } from '../models/user.model';
import { RequestTrackerService } from './services/request-tracker.service';

describe('AccessKeyController', () => {
  let controller: AccessKeyController;
  let service: AccessKeyService;

  const mockAccessKeyModel = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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
      controllers: [AccessKeyController],
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

    controller = module.get<AccessKeyController>(AccessKeyController);
    service = module.get<AccessKeyService>(AccessKeyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleGenerateAccessKey', () => {
    it('should generate an access key', async () => {
      const mockData = {
        userId: 'test-user',
        rateLimit: 20,
        expiry: new Date(),
      };

      const mockAccessKey = 'test-access-key';
      jest.spyOn(service, 'getAccessKey').mockResolvedValue(mockAccessKey);

      const result = await controller.handleGenerateAccessKey(mockData);
      expect(result).toBe(mockAccessKey);
      expect(service.getAccessKey).toHaveBeenCalledWith(
        mockData.userId,
        mockData.rateLimit,
        mockData.expiry,
      );
    });
  });

  describe('handleValidateAccessKey', () => {
    it('should validate an access key', async () => {
      const mockData = { accessKey: 'test-key' };
      jest.spyOn(service, 'validateAccessKey').mockResolvedValue(true);

      const result = await controller.handleValidateAccessKey(mockData);
      expect(result).toBe(true);
      expect(service.validateAccessKey).toHaveBeenCalledWith(mockData.accessKey);
    });
  });

  describe('handleGetUserAccessKeys', () => {
    it('should get user access keys', async () => {
      const mockData = { accessKey: 'test-key' };
      const mockKeys: AccessKey[] = [{
        id: 1,
        accessKey: 'test-key',
        rateLimitPerMinute: 1000,
        expiryDate: new Date(),
        status: 'active',
        userId: 1,
        usageCount: 0,
        user: {} as User,
      } as AccessKey];
      jest.spyOn(service, 'getUserAccessKeys').mockResolvedValue(mockKeys);

      const result = await controller.handleGetUserAccessKeys(mockData);
      expect(result).toBe(mockKeys);
      expect(service.getUserAccessKeys).toHaveBeenCalledWith(mockData.accessKey);
    });
  });
});
