import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserModel } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { ErrorMessage } from '../../constants/errors';
import { InMemoryDB } from '../../database/inMemoryDB';

@Injectable()
export class UsersService {
  private users: InMemoryDB<UserModel> = new InMemoryDB<UserModel>();
  private logger = new Logger(UsersService.name);

  getAll = async (): Promise<UserModel[]> => {
    this.logger.log('Getting all users');
    return await this.users.getAll();
  };

  getOne = async (id: string): Promise<UserModel> => {
    this.logger.log(`Getting user ${id}`);
    return await this.users.getOne(id);
  };

  create = async (userData: CreateUserDto): Promise<UserModel> => {
    const timing = Date.now();
    const newUser = new UserModel({
      ...userData,
      id: uuid(),
      version: 1,
      createdAt: timing,
      updatedAt: timing,
    });

    this.logger.log(`Creating user ${newUser.id}`);
    return await this.users.post(newUser);
  };

  update = async (id: string, dataToUpdate: UpdateUserDto) => {
    const user = await this.users.getOne(id);
    if (!user) {
      return null;
    }

    if (dataToUpdate.oldPassword !== user.password) {
      return ErrorMessage.PASSWORD_INCORRECT;
    }
    const updatedUser = new UserModel({
      ...user,
      password: dataToUpdate.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });
    this.logger.log(`Updating user ${id}`);
    return await this.users.update(id, updatedUser);
  };

  delete = async (id: string) => {
    this.logger.log(`Deleting user ${id}`);
    return await this.users.delete(id);
  };
}
