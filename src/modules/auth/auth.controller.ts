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
}
