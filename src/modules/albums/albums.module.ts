import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, InMemoryDBService],
})
export class AlbumsModule {}
