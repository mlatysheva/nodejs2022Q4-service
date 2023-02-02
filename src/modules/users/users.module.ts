import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, InMemoryDBService],
})
export class UsersModule {}
