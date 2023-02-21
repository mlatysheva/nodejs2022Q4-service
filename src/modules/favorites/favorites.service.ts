import { Injectable, Logger } from '@nestjs/common';

import { FavoritesEntity } from './entities/favorite.entity';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoritesEntity)
    private favoritesService: Repository<FavoritesEntity>,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  private logger = new Logger(FavoritesService.name);

  doesExist = async (id, array) => {
    for (const item of array) {
      if (item.id === id) {
        return true;
      }
    }
    return false;
  };

  getAll = async () => {
    const favorites = await this.favoritesService.find({
      relations: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });
    this.logger.log(`Getting all favorites`);

    if (favorites.length === 0) {
      return await this.favoritesService.save({
        artists: [],
        albums: [],
        tracks: [],
      });
    } else {
      return favorites[0];
    }
  };

  addAlbum = async (id: string) => {
    const album = await this.albumsService.getOne(id);
    if (!album) {
      this.logger.warn(`You are trying to add Album ${id} that does not exist`);
      return null;
    }

    const favorites = await this.getAll();
    const albumExists = await this.doesExist(id, favorites.albums);
    if (!albumExists) {
      favorites.albums.push(album);
      this.logger.log(`Adding album ${id} to favorites`);
      await this.favoritesService.save(favorites);
    }
    return album;
  };

  removeAlbum = async (id: string) => {
    const favorites = await this.getAll();
    const albumExists = await this.doesExist(id, favorites.albums);

    if (!albumExists) {
      this.logger.warn(
        `You are trying to remove Album ${id} that has not been marked as a favorite`,
      );

      return null;
    }
    favorites.albums = [...favorites.albums].filter((album) => album.id !== id);
    this.logger.log(`Removing album ${id} from favorites`);
    await this.favoritesService.save(favorites);
    return true;
  };

  addArtist = async (id: string) => {
    const artist = await this.artistsService.getOne(id);
    if (!artist) {
      this.logger.log(`You are trying to add artist ${id} that does not exist`);
      return null;
    }

    const favorites = await this.getAll();
    const artistExists = await this.doesExist(id, favorites.artists);
    if (!artistExists) {
      favorites.artists.push(artist);
      this.logger.log(`Adding artist ${id} to favorites`);
      await this.favoritesService.save(favorites);
    }
    return artist;
  };

  removeArtist = async (id: string) => {
    const favorites = await this.getAll();
    const artistExists = await this.doesExist(id, favorites.artists);

    if (!artistExists) {
      this.logger.warn(
        `You are trying to remove artist ${id} that has not been marked as a favorite`,
      );

      return null;
    }
    favorites.artists = [...favorites.artists].filter(
      (artist) => artist.id !== id,
    );
    this.logger.log(`Removing artist ${id} from favorites`);
    await this.favoritesService.save(favorites);
    return true;
  };

  addTrack = async (id: string) => {
    const track = await this.tracksService.getOne(id);
    if (!track) {
      this.logger.warn(`You are trying to add track ${id} that does not exist`);
      return null;
    }

    const favorites = await this.getAll();
    const trackExists = await this.doesExist(id, favorites.tracks);
    if (!trackExists) {
      favorites.tracks.push(track);
      this.logger.log(`Adding track ${id} to favorites`);
      await this.favoritesService.save(favorites);
    }
    return track;
  };

  removeTrack = async (id: string) => {
    const favorites = await this.getAll();
    this.logger.log(`Removing track ${id} from favorites`);

    const trackExists = await this.doesExist(id, favorites.tracks);

    if (!trackExists) {
      this.logger.warn(
        `You are trying to remove track ${id} that has not been marked as a favorite`,
      );
      return null;
    }
    favorites.tracks = [...favorites.tracks].filter((track) => track.id !== id);
    this.logger.log(`Removing track ${id} from favorites`);
    await this.favoritesService.save(favorites);
    return true;
  };
}
