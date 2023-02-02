import { Injectable, Logger } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid } from 'uuid';
import { ArtistModel } from './entities/artist.entity';
import { InMemoryDB } from '../../database/inMemoryDB';

@Injectable()
export class ArtistsService {
  private artists: InMemoryDB<ArtistModel> = new InMemoryDB<ArtistModel>();
  private logger = new Logger(ArtistsService.name);

  getAll = async (): Promise<Array<ArtistModel>> => {
    this.logger.log('Getting all artists');
    return await this.artists.getAll();
  };

  getOne = async (id: string): Promise<ArtistModel> => {
    this.logger.log(`Getting artist ${id}`);
    return await this.artists.getOne(id);
  };

  create = async (artistData: CreateArtistDto): Promise<ArtistModel> => {
    const newArtist: ArtistModel = {
      ...artistData,
      id: uuid(),
    };

    this.logger.log(`Creating artist ${newArtist.id}`);
    return await this.artists.post(newArtist);
  };

  update = async (
    id: string,
    artistData: UpdateArtistDto,
  ): Promise<ArtistModel> => {
    const artist = await this.artists.getOne(id);
    if (!artist) {
      return null;
    }

    const updatedArtist = {
      ...artist,
      ...artistData,
    };
    this.logger.log(`Updating artist ${id}`);
    return await this.artists.update(id, updatedArtist);
  };

  delete = async (id: string) => {
    this.logger.log(`Deleting artist ${id}`);
    return await this.artists.delete(id);
  };
}
