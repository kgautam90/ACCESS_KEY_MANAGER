import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessKeyService {
  getAccessKey() {
    return 'access_key';
  }
}
