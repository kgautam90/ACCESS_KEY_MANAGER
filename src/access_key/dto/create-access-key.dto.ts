import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAccessKeyDto {
  @ApiProperty({
    description: 'The ID of the user to generate the access key for',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The access key to be generated',
    example: 'ak_1234567890abcdef',
  })
  @IsString()
  accessKey?: string;

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