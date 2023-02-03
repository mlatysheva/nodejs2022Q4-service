import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';

@Module({
  controllers: [TracksController],
  providers: [
    TracksService,
    InMemoryDBService,
    FavoritesService,
    ArtistsService,
    AlbumsService,
  ],
})
export class TracksModule {}
