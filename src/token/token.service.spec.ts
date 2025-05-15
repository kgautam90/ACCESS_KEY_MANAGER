import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigService } from '../config/config.service';
import { TokenAttribute } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let logger: CustomLoggerService;
  let configService: ConfigService;

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

    service = module.get<TokenService>(TokenService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getToken', () => {
    it('should return token configuration', () => {
      const accessKey = 'test-key';
      const expectedToken: TokenAttribute = {
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

      const result = service.getToken(accessKey);
      expect(result).toEqual(expectedToken);
      expect(logger.log).toHaveBeenCalledWith('Generating token', 'TokenService');
    });
  });
});
