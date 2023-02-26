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
import { LoginDto } from './dto/login.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { ErrorMessage } from '../../constants/errors';

// export const GetCurrentUser = createParamDecorator(
//   (data: string | undefined, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();

//     if (!data) {
//       return request.user;
//     }

//     return request.user[data];
//   },
// );

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
    // if (!tokens) {
    //   throw new ForbiddenException(ErrorMessage.NOT_FOUND);
    // }
    // return tokens;
  }
}
