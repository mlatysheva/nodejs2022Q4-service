import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import 'dotenv/config';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async createTokens(userId: string, login: string) {
    const payload = { sub: userId, login: login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });
    return { accessToken, refreshToken };
  }

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      return null;
    }

    const samePassword = await bcrypt.compare(password, user.password);

    return samePassword ? user : null;
  }

  async getDataFromToken(token: string) {
    try {
      const tokenData = await this.jwtService.verifyAsync(token, {
        maxAge: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      return tokenData;
    } catch (error) {
      return false;
    }
  }

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

  async refresh(dto: RefreshDto) {
    const tokenData = await this.getDataFromToken(dto.refreshToken);

    if (!tokenData) {
      return null;
    }

    const user = await this.usersService.findByLogin(tokenData.login);

    if (!user || user.id !== tokenData.id) {
      return null;
    }

    return await this.createTokens(user.id, user.login);
  }
}
