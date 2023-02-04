import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuid } from 'uuid';
import { TrackModel } from './entities/track.entity';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { FavoritesService } from '../favorites/favorites.service';

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
    this.logger.log(`Creating track ${newTrack.id}`);
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
    await this.favoritesService.removeTrack(id);
    return await TracksService.tracks.delete(id);
  };

  removeArtistId = async (id: string) => {
    await TracksService.tracks.setIdToNull(id, 'artistId');
  };

  removeAlbumId = async (id: string) => {
    await TracksService.tracks.setIdToNull(id, 'albumId');
  };
}
