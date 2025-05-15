import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateAccessKeyDto {
  @ApiProperty({
    description: 'Rate limit per minute for this access key',
    example: 60,
    default: 60,
  })
  @IsNumber()
  rateLimit?: number;

  @ApiProperty({
    description: 'Expiry date for the access key',
    example: '2025-12-31T23:59:59Z'
  })
  @IsDate()
  @Type(() => Date)
  expiry?: Date;
} 