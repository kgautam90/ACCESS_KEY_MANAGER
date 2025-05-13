import { Module } from '@nestjs/common';
import { AccessKeyController } from './access_key.controller';
import { AccessKeyService } from './access_key.service';

@Module({
  controllers: [AccessKeyController],
  providers: [AccessKeyService]
})
export class AccessKeyModule {}
