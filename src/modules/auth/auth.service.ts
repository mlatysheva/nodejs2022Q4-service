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
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // async updateRefreshToken(id: string, newRefreshToken: string) {
  //   await this.usersService.updateRefreshToken(id, newRefreshToken);
  // }

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

  // async getTokens(userId: string, login: string) {
  //   const accessToken = await this.createAccessToken(userId, login);
  //   const refreshToken = await this.createRefreshToken(userId, login);
  //   return { accessToken, refreshToken };
  // }

  private generateToken = async (data, options?) => {
    const token = this.jwtService.sign(data, options);

    return token;
  };

  private getTokens = async (userId, login) => {
    const user = { id: userId, login: login };
    return {
      accessToken: await this.generateToken(user),
      refreshToken: await this.generateToken(
        { ...user, isRefresh: true },
        { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME },
      ),
    };
  };

  private validateUser = async (login: string, password: string) => {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      return null;
    }

    const samePassword = await bcrypt.compare(password, user.password);

    return samePassword ? user : null;
  };

  async signup(dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  async login(loginUserDto: LoginDto) {
    const user = await this.validateUser(
      loginUserDto.login,
      loginUserDto.password,
    );

    if (!user) {
      return null;
    }

    return await this.createTokens(user.id, user.login);
  }
}
