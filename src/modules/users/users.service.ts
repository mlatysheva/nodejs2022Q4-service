import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from './entities/user.entity';
import { ErrorMessage } from '../../constants/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private logger = new Logger(UsersService.name);

  findByLogin = async (login: string) => {
    return await this.userRepository.findOneBy({ login });
  };

  doesLoginExist = async (login: string) => {
    const user = await this.findByLogin(login);
    if (user) {
      throw new BadRequestException(ErrorMessage.ALREADY_EXISTS);
    }
  };

  getAll = async () => {
    const users = await this.userRepository.find();
    this.logger.log('Getting all users');
    return users.map((user) => user.toResponse());
  };

  getOne = async (id: string) => {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      this.logger.log(`Getting user ${id}`);
      return user.toResponse();
    }
    throw new NotFoundException(ErrorMessage.NOT_FOUND);
  };

  create = async (userData: CreateUserDto) => {
    const userDTO = {
      ...userData,
      version: 1,
    };
    const createdUser = this.userRepository.create(userDTO);

    this.logger.log(`Creating user`);
    return (await this.userRepository.save(createdUser)).toResponse();
  };

  update = async (id: string, userData: UpdateUserDto) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }

    if (
      userData.oldPassword !== user.password ||
      userData.newPassword === userData.oldPassword
    ) {
      return ErrorMessage.PASSWORD_INCORRECT;
    }

    if (user) {
      this.logger.log(`Updating user ${id}`);
      user.password = userData.newPassword;
      user.version += 1;
      return (await this.userRepository.save(user)).toResponse();
    } else {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
  };

  delete = async (id: string) => {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }
    this.logger.log(`Deleting user ${id}`);

    return await this.userRepository.delete({ id });
  };
}
