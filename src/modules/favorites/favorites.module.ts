import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    AlbumsService,
    TracksService,
    ArtistsService,
    InMemoryDBService,
  ],
})
export class FavoritesModule {}
