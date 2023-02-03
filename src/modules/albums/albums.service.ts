import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { AlbumModel } from './entities/album.entity';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  private static albums: InMemoryDBService<AlbumModel> =
    new InMemoryDBService<AlbumModel>();

  private logger = new Logger(AlbumsService.name);

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  getAll = async (): Promise<AlbumModel[]> => {
    this.logger.log('Getting all albums');
    return await AlbumsService.albums.getAll();
  };

  getOne = async (id: string): Promise<AlbumModel> => {
    this.logger.log(`Getting album ${id}`);
    return await AlbumsService.albums.getOne(id);
  };

  create = async (albumData: CreateAlbumDto): Promise<AlbumModel> => {
    const newAlbum: AlbumModel = {
      ...albumData,
      id: uuid(),
    };
    this.logger.log(`Creating album ${newAlbum.id}`);
    return await AlbumsService.albums.post(newAlbum);
  };

  update = async (
    id: string,
    albumData: UpdateAlbumDto,
  ): Promise<AlbumModel> => {
    const album = await AlbumsService.albums.getOne(id);
    if (!album) {
      return null;
    }

    const updatedAlbum = {
      ...album,
      ...albumData,
    };

    this.logger.log(`Updating album ${id}`);
    return await AlbumsService.albums.update(id, updatedAlbum);
  };

  delete = async (id: string): Promise<boolean> => {
    this.logger.log(`Deleting album ${id}`);
    await this.tracksService.removeAlbumId(id);
    // await this.favoritesService.deleteAlbumFromFavorites(id);
    return await AlbumsService.albums.delete(id);
  };

  removeArtistId = async (id: string): Promise<void> => {
    this.logger.log(`Removing artist id ${id} from album`);
    await AlbumsService.albums.setIdToNull(id, 'artistId');
  };
}
