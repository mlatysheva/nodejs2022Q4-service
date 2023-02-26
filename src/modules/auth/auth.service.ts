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

  async signup(dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByLogin(dto.login);
    if (!user) {
      return null;
    }
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      return null;
    }
    const tokens = await this.createTokens(user.id, user.login);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
