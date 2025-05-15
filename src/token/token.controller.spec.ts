import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { TokenAttribute } from './token.service';

describe('TokenController', () => {
  let controller: TokenController;
  let service: TokenService;

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const mockConfigService = {
    getConfig: jest.fn(),
    getJwtSecret: jest.fn(),
    getJwtExpiration: jest.fn(),
    tokenConfig: {
      tokens: [
        {
          chainId: 1,
          address: '0x123',
          name: 'Test Token',
          symbol: 'TEST',
          decimals: 18,
          logoURI: 'https://example.com/logo.png',
        },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        TokenService,
        {
          provide: CustomLoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleToken', () => {
    it('should get a token', () => {
      const mockData = { accessKey: 'test-key' };
      const mockToken: TokenAttribute = {
        token: [
          {
            chainId: 1,
            address: '0x123',
            name: 'Test Token',
            symbol: 'TEST',
            decimals: 18,
            logoURI: 'https://example.com/logo.png',
          },
        ],
      };
      jest.spyOn(service, 'getToken').mockReturnValue(mockToken);

      const result = controller.handleToken(mockData);
      expect(result).toBe(mockToken);
      expect(service.getToken).toHaveBeenCalledWith(mockData.accessKey);
    });
  });
});
