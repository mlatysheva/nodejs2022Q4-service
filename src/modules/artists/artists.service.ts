import { Injectable } from '@nestjs/common';
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

  getAll = async (): Promise<Array<ArtistEntity>> => {
    return await this.artistsService.find();
  };

  getOne = async (id: string): Promise<ArtistEntity> => {
    return await this.artistsService.findOneBy({ id });
  };

  create = async (artistData: CreateArtistDto): Promise<ArtistEntity> => {
    const artist = await this.artistsService.create(artistData);
    return await this.artistsService.save(artist);
  };

  update = async (
    id: string,
    artistData: UpdateArtistDto,
  ): Promise<ArtistEntity> => {
    const artist = await this.artistsService.findOneBy({ id });
    if (!artist) {
      return null;
    }

    await this.artistsService.update({ id }, artistData);
    return await this.artistsService.findOneBy({ id });
  };

  delete = async (id: string) => {
    const artist = await this.artistsService.findOneBy({ id });
    if (!artist) {
      return null;
    }

    return await this.artistsService.delete({ id });
  };
}
