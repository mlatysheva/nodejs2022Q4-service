import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { FavoritesService } from './favorites.service';
import { UUID_VERSION } from '../../constants/uuidVersion';
import { ErrorMessage } from '../../constants/errors';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @HttpCode(StatusCodes.OK)
  async findAll() {
    return await this.favoritesService.getAll();
  }

  @Post('album/:id')
  @HttpCode(StatusCodes.CREATED)
  async createAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: StatusCodes.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const album = await this.favoritesService.addAlbum(id);
    if (!album) {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    return album;
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: StatusCodes.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const album = await this.favoritesService.removeAlbum(id);

    if (!album) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    return album;
  }

  @Post('artist/:id')
  @HttpCode(StatusCodes.CREATED)
  async createArtist(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: StatusCodes.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const artist = await this.favoritesService.addArtist(id);

    if (!artist) {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    return artist;
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeArtist(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: StatusCodes.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const artist = await this.favoritesService.removeArtist(id);

    if (!artist) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    return artist;
  }

  @Post('track/:id')
  @HttpCode(StatusCodes.CREATED)
  async createTrack(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: StatusCodes.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const track = await this.favoritesService.addTrack(id);

    if (!track) {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    return track;
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeTrack(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: StatusCodes.BAD_REQUEST as number,
        version: UUID_VERSION,
      }),
    )
    id: string,
  ) {
    const track = await this.favoritesService.removeTrack(id);

    if (!track) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    return track;
  }
}
