import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, InMemoryDBService],
})
export class TracksModule {}
