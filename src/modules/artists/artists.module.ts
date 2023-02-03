import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    TracksService,
    AlbumsService,
    FavoritesService,
    InMemoryDBService,
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
