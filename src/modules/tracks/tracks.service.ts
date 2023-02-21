import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { ErrorMessage } from '../../constants/errors';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackEntity)
    private tracksService: Repository<TrackEntity>,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
  ) {}

  private logger = new Logger(TracksService.name);

  checkArtistExists = async (artistId: string) => {
    const artist = await this.artistsService.getOne(artistId);
    if (!artist) {
      this.logger.warn(`Artist ${artistId} does not exist`);
      return null;
    } else {
      return artistId;
    }
  };

  checkAlbumExists = async (albumId: string) => {
    const album = await this.albumsService.getOne(albumId);
    if (!album) {
      this.logger.warn(`Album ${albumId} does not exist`);
      return null;
    } else {
      return albumId;
    }
  };

  getAll = async () => {
    this.logger.log('Getting all tracks');
    return await this.tracksService.find();
  };

  getOne = async (id: string) => {
    this.logger.log(`Getting track ${id}`);
    return await this.tracksService.findOneBy({ id });
  };

  create = async (trackData: CreateTrackDto) => {
    if (trackData.albumId) {
      trackData.albumId = await this.checkAlbumExists(trackData.albumId);
    }
    if (trackData.artistId) {
      trackData.artistId = await this.checkArtistExists(trackData.artistId);
    }
    const track = this.tracksService.create(trackData);
    this.logger.log(`Creating the track`);
    return await this.tracksService.save(track);
  };

  update = async (id: string, trackData: UpdateTrackDto) => {
    if (trackData.albumId) {
      trackData.albumId = await this.checkAlbumExists(trackData.albumId);
    }
    if (trackData.artistId) {
      trackData.artistId = await this.checkArtistExists(trackData.artistId);
    }
    const track = await this.tracksService.findOneBy({ id });
    if (track) {
      this.logger.log(`Updating track ${id}`);
      await this.tracksService.update({ id }, trackData);
      return await this.tracksService.findOneBy({ id });
    } else {
      this.logger.warn(`Track ${id} does not exist`);
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
  };

  delete = async (id: string) => {
    this.logger.log(`Deleting track ${id}`);
    const result = await this.tracksService.delete({ id });
    if (result) {
      return true;
    } else {
      this.logger.warn(
        `You are trying to delete Track ${id} that does not exist`,
      );
      return false;
    }
  };
}
