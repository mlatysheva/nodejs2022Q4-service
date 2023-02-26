import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import 'dotenv/config';
import { ErrorMessage } from '../../../constants/errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY,
    });
  }

  async validate(id: string, login: string) {
    const existingUser = await this.usersService.findByLogin(login);
    if (!existingUser || existingUser.id !== id) {
      throw new UnauthorizedException(ErrorMessage.NOT_AUTHORISED);
    }
    return { id, login };
  }
}
