import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.log('UsersService initialized', 'UsersService');
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = await this.userModel.create(userData);
      this.logger.debug(`Created user with id: ${user.id}`, 'UsersService');
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error.stack, 'UsersService');
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await this.userModel.findAndCountAll({
        limit,
        offset,
        include: ['accessKeys'],
      });
      this.logger.debug(`Found ${rows.length} users`, 'UsersService');
      return { users: rows, total: count };
    } catch (error) {
      this.logger.error('Error fetching users', error.stack, 'UsersService');
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userModel.findByPk(id, {
        include: ['accessKeys'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.debug(`Found user with id: ${user.id}`, 'UsersService');
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user ${id}`, error.stack, 'UsersService');
      throw error;
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await user.update(userData);
      this.logger.debug(`Updated user with id: ${user.id}`, 'UsersService');
      return user;
    } catch (error) {
      this.logger.error(`Error updating user ${id}`, error.stack, 'UsersService');
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await user.destroy();
      this.logger.debug(`Deleted user with id: ${id}`, 'UsersService');
    } catch (error) {
      this.logger.error(`Error deleting user ${id}`, error.stack, 'UsersService');
      throw error;
    }
  }
} 