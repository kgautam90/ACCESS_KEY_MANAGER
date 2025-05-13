import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  getToken() {
    return 'token';
  }
}
