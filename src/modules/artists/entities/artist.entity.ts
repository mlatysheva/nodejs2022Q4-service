import { IArtist } from '../../../types/types';

export class ArtistModel implements IArtist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(partial: Partial<ArtistModel>) {
    Object.assign(this, partial);
  }
}
