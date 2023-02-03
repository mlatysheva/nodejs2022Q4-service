import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid } from 'uuid';
import { ArtistModel } from './entities/artist.entity';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private static artists: InMemoryDBService<ArtistModel> =
    new InMemoryDBService<ArtistModel>();

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  private logger = new Logger(ArtistsService.name);

  getAll = async (): Promise<Array<ArtistModel>> => {
    this.logger.log('Getting all artists');
    return await ArtistsService.artists.getAll();
  };

  getOne = async (id: string): Promise<ArtistModel> => {
    this.logger.log(`Getting artist ${id}`);
    return await ArtistsService.artists.getOne(id);
  };

  create = async (artistData: CreateArtistDto): Promise<ArtistModel> => {
    const newArtist: ArtistModel = {
      ...artistData,
      id: uuid(),
    };

    this.logger.log(`Creating artist ${newArtist.id}`);
    return await ArtistsService.artists.post(newArtist);
  };

  update = async (
    id: string,
    artistData: UpdateArtistDto,
  ): Promise<ArtistModel> => {
    const artist = await ArtistsService.artists.getOne(id);
    if (!artist) {
      return null;
    }

    const updatedArtist = {
      ...artist,
      ...artistData,
    };
    this.logger.log(`Updating artist ${id}`);
    return await ArtistsService.artists.update(id, updatedArtist);
  };

  delete = async (id: string) => {
    this.logger.log(`Deleting artist ${id}`);
    this.logger.log(
      `tracksService is ${(await this.tracksService.getAll()).length}`,
    );
    this.logger.log(
      `albumsService is ${(await this.albumsService.getAll()).length}`,
    );
    await this.tracksService.removeArtistId(id);
    await this.albumsService.removeArtistId(id);
    // await this.favoritesService.deleteArtistFromFavorites(id);
    return await ArtistsService.artists.delete(id);
  };
}
