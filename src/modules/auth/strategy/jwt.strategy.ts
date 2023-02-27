import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import 'dotenv/config';
import { ErrorMessage } from '../../../constants/errors';

type JwtPayload = {
  sub: string;
  username: string;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY,
    });
  }

  async validate(data: JwtPayload) {
    const existingUser = await this.usersService.findByLogin(data.username);
    if (!existingUser || existingUser.id !== data.sub) {
      throw new UnauthorizedException(ErrorMessage.NOT_AUTHORISED);
    }
    return data;
  }
}
