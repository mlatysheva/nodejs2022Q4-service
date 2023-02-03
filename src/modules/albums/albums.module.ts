import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';

@Module({
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    TracksService,
    FavoritesService,
    ArtistsService,
    InMemoryDBService,
  ],
})
export class AlbumsModule {}
