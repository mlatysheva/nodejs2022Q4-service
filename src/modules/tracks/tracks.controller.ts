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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UUID_VERSION } from '../../constants/uuidVersion';
import { ErrorMessage } from '../../constants/errors';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.tracksService.getAll();
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
    const track = await this.tracksService.getOne(id);
    if (!track) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    if (Object(track).id === undefined) {
      throw new HttpException(ErrorMessage.NO_CONTENT, HttpStatus.NO_CONTENT);
    }
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    trackData: CreateTrackDto,
  ) {
    return await this.tracksService.create(trackData);
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
    trackData: UpdateTrackDto,
  ) {
    const track = await this.tracksService.getOne(id);
    if (!track) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return this.tracksService.update(id, trackData);
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
    const track = await this.tracksService.getOne(id);
    if (!track) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return await this.tracksService.delete(id);
  }
}
