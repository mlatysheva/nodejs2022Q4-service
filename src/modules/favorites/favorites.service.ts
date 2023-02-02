import {
  Inject,
  Injectable,
  Logger,
  forwardRef,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesResponse } from './entities/favoritesResponse.entity';
import { FavoritesModel } from './entities/favorites.entity';
import { ErrorMessage } from '../../constants/errors';

@Injectable()
export class FavoritesService {
  private favorites: FavoritesModel = {
    artists: [],
    albums: [],
    tracks: [],
  };
  private logger = new Logger(FavoritesService.name);

  constructor(
    private tracksService: TracksService,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
  ) {}

  async addTrackToFavorites(trackId: string) {
    try {
      await this.tracksService.getOne(trackId);
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    const doesExist = this.favorites.tracks.includes(trackId);
    if (doesExist) {
      throw new UnprocessableEntityException(ErrorMessage.ALREADY_EXISTS);
    } else {
      this.logger.log(`Adding track ${trackId} to favorites`);
      return this.favorites.tracks.push(trackId);
    }
  }

  async addAlbumToFavorites(albumId: string) {
    try {
      await this.albumsService.getOne(albumId);
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    const doesExist = this.favorites.albums.includes(albumId);
    if (doesExist) {
      throw new UnprocessableEntityException(ErrorMessage.ALREADY_EXISTS);
    } else {
      this.logger.log(`Adding album ${albumId} to favorites`);
      return this.favorites.albums.push(albumId);
    }
  }

  async addArtistToFavorites(artistId: string) {
    try {
      await this.artistsService.getOne(artistId);
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    const doesExist = this.favorites.artists.includes(artistId);
    if (doesExist) {
      throw new UnprocessableEntityException(ErrorMessage.ALREADY_EXISTS);
    } else {
      this.logger.log(`Adding artist ${artistId} to favorites`);
      return this.favorites.artists.push(artistId);
    }
  }

  async getAll() {
    const favoritesResponse: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };
    const tracks = this.favorites.tracks;
    const albums = this.favorites.albums;
    const artists = this.favorites.artists;
    try {
      for (const track of tracks) {
        favoritesResponse.tracks.push(await this.tracksService.getOne(track));
      }
      for (const album of albums) {
        favoritesResponse.albums.push(await this.albumsService.getOne(album));
      }
      for (const artist of artists) {
        favoritesResponse.artists.push(
          await this.artistsService.getOne(artist),
        );
      }
      this.logger.log(`Getting all favorites`);

      return favoritesResponse;
    } catch {
      throw new BadRequestException(ErrorMessage.NO_CONTENT);
    }
  }

  deleteTrackFromFavorites(trackId: string) {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    } else {
      this.logger.log(`Deleting track ${trackId} from favorites`);

      this.favorites.tracks = this.favorites.tracks.filter((track) => {
        track !== trackId;
      });
    }
  }

  deleteAlbumFromFavorites(albumId: string) {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    } else {
      this.logger.log(`Deleting album ${albumId} from favorites`);

      this.favorites.albums = this.favorites.albums.filter((album) => {
        album !== albumId;
      });
    }
  }

  deleteArtistFromFavorites(artistId: string) {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    } else {
      this.logger.log(`Deleting artist ${artistId} from favorites`);

      this.favorites.artists = this.favorites.artists.filter((artist) => {
        artist !== artistId;
      });
    }
  }
}
