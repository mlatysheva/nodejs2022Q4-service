import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuid } from 'uuid';
import { TrackModel } from './entities/track.entity';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class TracksService {
  private static tracks: InMemoryDBService<TrackModel> =
    new InMemoryDBService<TrackModel>();
  private logger = new Logger(TracksService.name);

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  getAll = async () => {
    this.logger.log('Getting all tracks');
    return await TracksService.tracks.getAll();
  };

  getOne = async (id: string) => {
    this.logger.log(`Getting track ${id}`);
    return await TracksService.tracks.getOne(id);
  };

  create = async (trackData: CreateTrackDto) => {
    const newTrack = new TrackModel({
      ...trackData,
      id: uuid(),
    });
    this.logger.log(
      `Creating track ${newTrack.id}, albumid is ${newTrack.albumId}`,
    );
    return await TracksService.tracks.post(newTrack);
  };

  update = async (id: string, trackData: UpdateTrackDto) => {
    const track = await TracksService.tracks.getOne(id);
    if (!track) {
      return null;
    }

    const updatedTrack = new TrackModel({
      ...track,
      ...trackData,
    });

    this.logger.log(`Updating track ${id}`);

    return await TracksService.tracks.update(id, updatedTrack);
  };

  delete = async (id: string) => {
    this.logger.log(`Deleting track ${id}`);
    // await this.favoritesService.deleteTrackFromFavorites(id);
    return await TracksService.tracks.delete(id);
  };

  removeArtistId = async (id: string) => {
    this.logger.log(`Removing artist ${id} from tracks`);

    await TracksService.tracks.setIdToNull(id, 'artistId');
  };

  removeAlbumId = async (id: string) => {
    this.logger.log(`Removing album ${id} from tracks`);
    this.logger.log(
      `Number of tracks is ${(await TracksService.tracks.getAll()).length}`,
    );
    await TracksService.tracks.setIdToNull(id, 'albumId');
  };
}
