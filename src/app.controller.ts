import { Controller, Get, Inject, Post, UseGuards, Body, HttpException, HttpStatus, Param, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccessKeyDto } from './access_key/dto/create-access-key.dto';
import { UpdateAccessKeyDto } from './access_key/dto/update-access-key.dto';
import { AccessKeyGuard } from './access_key/guards/access-key.guard';

@ApiTags('access-key-management')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('SERVICE_ACCESS_KEY') private readonly clientA: ClientProxy,
    @Inject('SERVICE_TOKEN') private readonly clientB: ClientProxy,
  ) {}

  @Post('access-key/generate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate an access key for a user' })
  @ApiResponse({ status: 201, description: 'The access key for the user is generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateAccessKey(@Body() createAccessKeyDto: CreateAccessKeyDto): Promise<any> {
    try {
      const result = await this.clientA
        .send({ cmd: 'generate_access_key' }, createAccessKeyDto)
        .toPromise();
      return {
        status: HttpStatus.CREATED,
        message: 'Access key generated successfully',
        data: result
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error generating access key:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Put('access-key/update/:accessKey')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an access key for a user' })
  @ApiResponse({ status: 201, description: 'The access key for the user is updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAccessKey(@Body() updateAccessKeyDto: UpdateAccessKeyDto, @Param('accessKey') accessKey: string): Promise<any> {
    try {
      const result = await this.clientA
        .send({ cmd: 'update_access_key' }, {accessKey, ...updateAccessKeyDto})
        .toPromise();
      return {
        status: HttpStatus.CREATED,
        message: 'Access key updated successfully',
        data: result
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error updating access key:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete('access-key/:key')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an access key' })
  @ApiResponse({ status: 200, description: 'Access key is deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid access key' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccessKey(@Param('key') key: string): Promise<any> {
    try {
      const result = await this.clientA
        .send({ cmd: 'delete_access_key' }, { accessKey: key })
        .toPromise();
      return {
        status: HttpStatus.OK,
        message: 'Access key deleted successfully',
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error deleting access key:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('access-key/disable/:key')
  @ApiParam({ name: 'key', type: String, description: 'The access key to disable' })
  @ApiOperation({ summary: 'Disable an access key' })
  @ApiResponse({ status: 200, description: 'Access key is disabled' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid access key' })
  async disableAccessKey(@Param('key') key: string): Promise<any> {
    try {
      const result = await this.clientA
        .send({ cmd: 'disable_access_key' }, { accessKey: key })
        .toPromise();
      return {
        status: HttpStatus.OK,
        message: result ? 'Access key is disabled' : 'Access key is invalid',
        data: { isDisabled: result }
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error disabling access key:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('access-key/user/:key')
  @ApiOperation({ summary: 'Get access keys details for a user' })
  @ApiResponse({ status: 200, description: 'Access keys details retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid access key' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserAccessKeys(@Param('key') key: string): Promise<any> {
    try {
      const result = await this.clientA
        .send({ cmd: 'get_user_access_keys' }, { accessKey: key })
        .toPromise();
      return {
        status: HttpStatus.OK,
        message: 'User access keys retrieved successfully',
        data: result
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error getting user access keys:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('access-keys')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all access keys' })
  @ApiResponse({ status: 200, description: 'List of access keys retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllAccessKeys(): Promise<any> {
    try {
      const result = await this.clientA
        .send({ cmd: 'get_access_keys' }, {})
        .toPromise();
      return {
        status: HttpStatus.OK,
        message: 'Access keys retrieved successfully',
        data: result
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error getting access keys:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('token/:key')
  @UseGuards(AccessKeyGuard)
  @ApiOperation({ summary: 'Get a token' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async getToken(@Param('key') key: string): Promise<any> {
    try {
      const result = await this.clientB.send({ cmd: 'token' }, { accessKey: key }).toPromise();
      return {
        status: HttpStatus.OK,
        message: 'Token generated successfully',
        data: result
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message
        }, HttpStatus.BAD_REQUEST);
      }
      console.error('Error getting token:', error);
      throw error;
    }
  }
}
