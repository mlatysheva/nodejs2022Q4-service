import { IAlbum } from '../../../types/types';

export class AlbumModel implements IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(partial: Partial<AlbumModel>) {
    Object.assign(this, partial);
  }
}
