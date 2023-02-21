import { Injectable, Logger } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistsService: Repository<ArtistEntity>,
  ) {}

  private logger = new Logger(ArtistsService.name);

  getAll = async (): Promise<Array<ArtistEntity>> => {
    this.logger.log('Getting all artists');
    return await this.artistsService.find();
  };

  getOne = async (id: string): Promise<ArtistEntity> => {
    this.logger.log(`Getting artist ${id}`);
    return await this.artistsService.findOneBy({ id });
  };

  create = async (artistData: CreateArtistDto): Promise<ArtistEntity> => {
    const artist = await this.artistsService.create(artistData);
    this.logger.log(`Creating the artist`);
    return await this.artistsService.save(artist);
  };

  update = async (
    id: string,
    artistData: UpdateArtistDto,
  ): Promise<ArtistEntity> => {
    const artist = await this.artistsService.findOneBy({ id });
    if (!artist) {
      this.logger.warn(`Artist ${id} does not exist`);
      return null;
    }

    await this.artistsService.update({ id }, artistData);
    this.logger.log(`Updating artist ${id}`);
    return await this.artistsService.findOneBy({ id });
  };

  delete = async (id: string) => {
    const artist = await this.artistsService.findOneBy({ id });
    if (!artist) {
      this.logger.warn(`Artist ${id} does not exist`);
      return null;
    }

    this.logger.log(`Deleting artist ${id}`);
    return await this.artistsService.delete({ id });
  };
}
