import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
    
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern({ cmd: 'token' })
  handleToken(@Payload() data: any): string {
    console.log('Received token request:', data);
    return this.tokenService.getToken();
  }
}