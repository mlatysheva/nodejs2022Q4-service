import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/createUser.dto';

export interface JwtPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.usersService.findByLogin(login);
    // const passwordValid = await bcrypt.compare(pass, user.hash);
    // if (user && passwordValid) {
    //   return user;
    // }
    return null;
  }

  async signup(dto: CreateUserDto) {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Login or password is empty');
    }
    const user = await this.usersService.create(dto);
    return user;
  }

  async login(loginUserDto: LoginDto) {
    if (!loginUserDto.login || !loginUserDto.password) {
      throw new BadRequestException('Login or password is empty');
    }
    const user = await this.usersService.findByLogin(loginUserDto.login);
    console.log('in login user is:');
    console.dir(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // const passwordValid = await bcrypt.compare(
    //   loginUserDto.password,
    //   user.hash,
    // );
    // if (!passwordValid) {
    //   throw new ForbiddenException('Incorrect password');
    // }
    const tokens = await this.createTokens(user.id, user.login);
    return tokens;
  }

  async createTokens(userId: string, login: string) {
    const payload = { sub: userId, login: login };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });
    return { accessToken, refreshToken };
  }
}
