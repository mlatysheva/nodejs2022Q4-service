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
import { FavoritesModel } from './entities/favorites.entity';
import { FavoritesResponse } from './entities/favoritesResponse.entity';
import { ErrorMessage } from '../../constants/errors';

@Injectable()
export class FavoritesService {
  private static favorites: FavoritesModel = {
    artists: [],
    albums: [],
    tracks: [],
  };
  private logger = new Logger(FavoritesService.name);

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}

  async addTrackToFavorites(trackId: string) {
    try {
      await this.tracksService.getOne(trackId);
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    const doesExist = await FavoritesService.favorites.tracks.includes(trackId);
    if (doesExist) {
      throw new UnprocessableEntityException(
        'Track already exists in favorites',
      );
    } else {
      this.logger.log(`Adding track ${trackId} to favorites`);
      return await FavoritesService.favorites.tracks.push(trackId);
    }
  }

  async addAlbumToFavorites(albumId: string) {
    try {
      await this.albumsService.getOne(albumId);
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    const doesExist = await FavoritesService.favorites.albums.includes(albumId);
    if (doesExist) {
      throw new UnprocessableEntityException(
        'Album already exists in favorites',
      );
    } else {
      this.logger.log(`Adding album ${albumId} to favorites`);

      return FavoritesService.favorites.albums.push(albumId);
    }
  }

  public addArtistToFavorites(artistId: string) {
    try {
      this.artistsService.getOne(artistId);
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.NOT_FOUND);
    }
    const doesExist = FavoritesService.favorites.artists.includes(artistId);
    if (doesExist) {
      throw new UnprocessableEntityException(
        'Artist already exists in favorites',
      );
    } else {
      this.logger.log(`Adding artist ${artistId} to favorites`);

      return FavoritesService.favorites.artists.push(artistId);
    }
  }

  async findAll() {
    const favoritesResponse: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };
    const tracks = FavoritesService.favorites.tracks;
    const albums = FavoritesService.favorites.albums;
    const artists = FavoritesService.favorites.artists;
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
      this.logger.log(
        `Getting all favorites ${favoritesResponse.albums.length}`,
      );

      return favoritesResponse;
    } catch {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    }
  }

  deleteTrackFromFavorites(trackId: string) {
    const index = FavoritesService.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    } else {
      FavoritesService.favorites.tracks =
        FavoritesService.favorites.tracks.filter((track) => {
          track !== trackId;
        });
      this.logger.log(`Deleting track ${trackId} to favorites`);

      return true;
    }
  }

  deleteAlbumFromFavorites(albumId: string) {
    const index = FavoritesService.favorites.albums.indexOf(albumId);
    if (index === -1) {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    } else {
      FavoritesService.favorites.albums =
        FavoritesService.favorites.albums.filter((album) => {
          album !== albumId;
        });
      this.logger.log(`Deleting album ${albumId} to favorites`);
      return true;
    }
  }

  deleteArtistFromFavorites(artistId: string) {
    const index = FavoritesService.favorites.artists.indexOf(artistId);
    if (index === -1) {
      throw new BadRequestException(ErrorMessage.NOT_FOUND);
    } else {
      FavoritesService.favorites.artists =
        FavoritesService.favorites.artists.filter((artist) => {
          artist !== artistId;
        });
      this.logger.log(`Deleting artist ${artistId} to favorites`);
      return true;
    }
  }
}
