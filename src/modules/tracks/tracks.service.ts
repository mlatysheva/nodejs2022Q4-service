import { Injectable, Logger } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuid } from 'uuid';
import { TrackModel } from './entities/track.entity';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Injectable()
export class TracksService {
  constructor(private readonly tracks: InMemoryDBService<TrackModel>) {}
  private logger = new Logger(TracksService.name);

  getAll = async () => {
    this.logger.log('Getting all tracks');
    return await this.tracks.getAll();
  };

  getOne = async (id: string) => {
    this.logger.log(`Getting track ${id}`);
    return await this.tracks.getOne(id);
  };

  create = async (trackData: CreateTrackDto) => {
    const newTrack = new TrackModel({
      ...trackData,
      id: uuid(),
    });
    this.logger.log(`Creating track ${newTrack.id}`);
    return await this.tracks.post(newTrack);
  };

  update = async (id: string, trackData: UpdateTrackDto) => {
    const track = await this.tracks.getOne(id);
    if (!track) {
      return null;
    }

    const updatedTrack = new TrackModel({
      ...track,
      ...trackData,
    });

    this.logger.log(`Updating track ${id}`);

    return await this.tracks.update(id, updatedTrack);
  };

  delete = async (id: string) => {
    this.logger.log(`Deleting track ${id}`);
    return await this.tracks.delete(id);
  };

  removeArtistId = async (id: string) => {
    await this.tracks.removeExternalId(id, 'artistId');
  };

  removeAlbumId = async (id: string) => {
    await this.tracks.removeExternalId(id, 'albumId');
  };
}
