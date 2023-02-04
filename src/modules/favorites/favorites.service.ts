import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { Favorite } from './entities/favorite.entity';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { IFavoritesResponse } from '../../types/types';
import { AlbumModel } from '../albums/entities/album.entity';
import { ArtistModel } from '../artists/entities/artist.entity';
import { TrackModel } from '../tracks/entities/track.entity';

@Injectable()
export class FavoritesService {
  private static favorites: Favorite = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private trackService: TracksService,
  ) {}

  private logger = new Logger(FavoritesService.name);

  private async getResolvedArray(array) {
    const arr = array.map((item) =>
      item.status === 'fulfilled' ? item.value : null,
    );

    return arr.filter((item) => item);
  }

  getAll = async (): Promise<IFavoritesResponse> => {
    const artists = await Promise.allSettled(
      FavoritesService.favorites.artists.map((artistId) =>
        this.artistService.getOne(artistId),
      ),
    );
    const albums = await Promise.allSettled(
      FavoritesService.favorites.albums.map((albumId) =>
        this.albumService.getOne(albumId),
      ),
    );
    const tracks = await Promise.allSettled(
      FavoritesService.favorites.tracks.map((trackId) =>
        this.trackService.getOne(trackId),
      ),
    );

    this.logger.log(`Getting all favorites`);

    return {
      artists: await this.getResolvedArray(artists),
      albums: await this.getResolvedArray(albums),
      tracks: await this.getResolvedArray(tracks),
    };
  };

  addAlbum = async (id: string): Promise<AlbumModel | null> => {
    const album = await this.albumService.getOne(id);

    if (!album) {
      return null;
    }

    const albumExists = FavoritesService.favorites.albums.includes(id);

    if (!albumExists) {
      FavoritesService.favorites.albums.push(id);
    }

    this.logger.log(`Adding album ${id} to favorites`);
    return album;
  };

  removeAlbum = async (id: string): Promise<boolean | null> => {
    const albumExists = FavoritesService.favorites.albums.includes(id);

    if (!albumExists) {
      return null;
    }

    FavoritesService.favorites.albums = [
      ...FavoritesService.favorites.albums,
    ].filter((albumId) => albumId !== id);

    this.logger.log(`Removing album ${id} from favorites`);
    return true;
  };

  addArtist = async (id: string): Promise<ArtistModel | null> => {
    const artist = await this.artistService.getOne(id);

    if (!artist) {
      return null;
    }

    const artistExists = FavoritesService.favorites.artists.includes(id);

    if (!artistExists) {
      FavoritesService.favorites.artists.push(id);
    }
    this.logger.log(`Adding artist ${id} to favorites`);

    return artist;
  };

  removeArtist = async (id: string): Promise<boolean | null> => {
    const artistExists = FavoritesService.favorites.artists.includes(id);

    if (!artistExists) {
      return null;
    }

    FavoritesService.favorites.artists = [
      ...FavoritesService.favorites.artists,
    ].filter((artistId) => artistId !== id);

    this.logger.log(`Removing artist ${id} from favorites`);

    return true;
  };

  addTrack = async (id: string): Promise<TrackModel | null> => {
    const track = await this.trackService.getOne(id);

    if (!track) {
      return null;
    }

    const trackExists = FavoritesService.favorites.tracks.includes(id);

    if (!trackExists) {
      FavoritesService.favorites.tracks.push(id);
    }
    this.logger.log(`Adding track ${id} to favorites`);

    return track;
  };

  removeTrack = async (id: string): Promise<boolean | null> => {
    const trackExists = FavoritesService.favorites.tracks.includes(id);

    if (!trackExists) {
      return null;
    }

    FavoritesService.favorites.tracks = [
      ...FavoritesService.favorites.tracks,
    ].filter((trackId) => trackId !== id);

    this.logger.log(`Removing track ${id} from favorites`);

    return true;
  };
}
