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
  HttpException,
  HttpStatus,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUID_VERSION } from '../../constants/uuidVersion';
import { ErrorMessage } from '../../constants/errors';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.albumsService.getAll();
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
    const album = await this.albumsService.getOne(id);

    if (!album) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    if (Object(album).id === undefined) {
      throw new HttpException(ErrorMessage.NO_CONTENT, HttpStatus.NO_CONTENT);
    }
    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    albumData: CreateAlbumDto,
  ) {
    return await this.albumsService.create(albumData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    albumData: UpdateAlbumDto,
  ) {
    const album = await this.albumsService.getOne(id);

    if (!album) {
      throw new HttpException(ErrorMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.albumsService.update(id, albumData);
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
    const album = await this.albumsService.getOne(id);
    if (!album) {
      throw new HttpException(ErrorMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return await this.albumsService.delete(id);
  }
}
