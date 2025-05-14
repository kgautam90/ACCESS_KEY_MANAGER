import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CustomLoggerService } from '../logger/logger.service';
import { User } from '../models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.log('UsersController initialized', 'UsersController');
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    this.logger.log('Creating new user', 'UsersController');
    try {
      const user = await this.usersService.create(userData);
      this.logger.debug(`User created successfully: ${user.id}`, 'UsersController');
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, 'UsersController');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    this.logger.log(`Fetching users page ${page} with limit ${limit}`, 'UsersController');
    try {
      const result = await this.usersService.findAll(page, limit);
      this.logger.debug(`Found ${result.users.length} users`, 'UsersController');
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack, 'UsersController');
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    this.logger.log(`Fetching user with id ${id}`, 'UsersController');
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      this.logger.debug(`User found: ${user.id}`, 'UsersController');
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${id}`, error.stack, 'UsersController');
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    this.logger.log(`Updating user ${id}`, 'UsersController');
    try {
      const user = await this.usersService.update(id, userData);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      this.logger.debug(`User updated successfully: ${user.id}`, 'UsersController');
      return user;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}`, error.stack, 'UsersController');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    this.logger.log(`Deleting user ${id}`, 'UsersController');
    try {
      await this.usersService.delete(id);
      this.logger.debug(`User deleted successfully: ${id}`, 'UsersController');
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}`, error.stack, 'UsersController');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 