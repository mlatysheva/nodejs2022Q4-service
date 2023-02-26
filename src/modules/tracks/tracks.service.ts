import { Injectable, NotFoundException } from '@nestjs/common';
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

  checkArtistExists = async (artistId: string) => {
    const artist = await this.artistsService.getOne(artistId);
    if (!artist) {
      return null;
    } else {
      return artistId;
    }
  };

  checkAlbumExists = async (albumId: string) => {
    const album = await this.albumsService.getOne(albumId);
    if (!album) {
      return null;
    } else {
      return albumId;
    }
  };

  getAll = async () => {
    return await this.tracksService.find();
  };

  getOne = async (id: string) => {
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
      await this.tracksService.update({ id }, trackData);
      return await this.tracksService.findOneBy({ id });
    } else {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
  };

  delete = async (id: string) => {
    const result = await this.tracksService.delete({ id });
    if (result) {
      return true;
    } else {
      return false;
    }
  };
}
