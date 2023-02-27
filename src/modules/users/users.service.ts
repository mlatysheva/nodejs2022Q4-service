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
import 'dotenv/config';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersService: Repository<UserEntity>,
  ) {}

  addHashPassword = async (password: string) => {
    return hash(password, Number(process.env.CRYPT_SALT));
  };

  findByLogin = async (login: string) => {
    return await this.usersService.findOneBy({ login });
  };

  doesLoginExist = async (login: string) => {
    const user = await this.findByLogin(login);
    if (user) {
      throw new BadRequestException(ErrorMessage.ALREADY_EXISTS);
    }
  };

  getAll = async () => {
    return await this.usersService.find();
  };

  getOne = async (id: string) => {
    return await this.usersService.findOneBy({ id });
  };

  create = async (createUserDto: CreateUserDto): Promise<UserEntity> => {
    const hashedPassword = await this.addHashPassword(createUserDto.password);
    const user = await this.usersService.create({
      login: createUserDto.login,
      password: hashedPassword,
    });

    return await this.usersService.save(user);
  };

  update = async (id: string, userData: UpdateUserDto) => {
    const user = await this.usersService.findOneBy({ id });
    if (!user) {
      return null;
    }

    const passwordValid = await compare(userData.oldPassword, user.password);

    if (!passwordValid) {
      return ErrorMessage.PASSWORD_INCORRECT;
    }

    if (user) {
      user.password = await this.addHashPassword(userData.newPassword);
      return await this.usersService.save(user);
    } else {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
  };

  delete = async (id: string) => {
    const user = await this.usersService.findOneBy({ id });

    if (!user) {
      return null;
    }
    return await this.usersService.delete({ id });
  };
}
