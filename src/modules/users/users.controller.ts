import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UUID_VERSION } from '../../constants/uuidVersion';
import { ErrorMessage } from '../../constants/errors';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const user = await this.usersService.getOne(id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    const userCopy = { ...user };
    delete userCopy.password;
    return userCopy;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    const userCopy = { ...user };
    delete userCopy.password;
    return userCopy;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
    @Body() { oldPassword, newPassword }: UpdateUserDto,
  ) {
    if (!oldPassword || !newPassword) {
      throw new BadRequestException(ErrorMessage.IVALID_BODY);
    }
    const user = await this.usersService.getOne(id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    const updatedUser = await this.usersService.update(id, {
      oldPassword,
      newPassword,
    });

    if (updatedUser === ErrorMessage.PASSWORD_INCORRECT) {
      throw new ForbiddenException(ErrorMessage.PASSWORD_INCORRECT);
    }

    const copyUser = { ...updatedUser };
    delete copyUser.password;
    return copyUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const user = await this.usersService.getOne(id);
    if (!user) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return await this.usersService.delete(id);
  }
}
