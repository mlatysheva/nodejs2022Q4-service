import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ErrorMessage } from '../../constants/errors';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto) {
    return await this.authService.signup(dto);
  }

  @Public()
  @UseInterceptors(ForbiddenException)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: CreateUserDto) {
    return await this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    const newTokens = await this.authService.refresh(dto);

    if (!newTokens) {
      throw new ForbiddenException(ErrorMessage.INVALID_REFRESH_TOKEN);
    }
    return newTokens;
  }
}
