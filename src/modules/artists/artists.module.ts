import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, InMemoryDBService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
