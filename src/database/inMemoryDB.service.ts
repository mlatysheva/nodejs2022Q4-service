import { Injectable } from '@nestjs/common';
import { InMemoryDB } from './inMemoryDB';
import { UserModel } from '../modules/users/entities/user.entity';
import { ArtistModel } from '../modules/artists/entities/artist.entity';

@Injectable()
export class DBService {
  public users: InMemoryDB<UserModel> = new InMemoryDB<UserModel>();
  public artists: InMemoryDB<ArtistModel> = new InMemoryDB<ArtistModel>();
}
