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
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUID_VERSION } from '../../constants/uuidVersion';
import { ErrorMessage } from '../../constants/errors';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.artistsService.getAll();
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
    const artist = await this.artistsService.getOne(id);
    if (!artist) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    // if (Object(artist).id === undefined) {
    //   throw new HttpException('Artist entry is empty.', HttpStatus.NO_CONTENT);
    // }
    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() artistData: CreateArtistDto) {
    return await this.artistsService.create(artistData);
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
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    artistData: UpdateArtistDto,
  ) {
    const artist = await this.artistsService.getOne(id);
    if (!artist) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return this.artistsService.update(id, artistData);
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
    const artist = await this.artistsService.getOne(id);
    if (!artist) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }

    return await this.artistsService.delete(id);
  }
}
