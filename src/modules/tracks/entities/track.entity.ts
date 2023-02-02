import { ITrack } from '../../../types/types';

export class TrackModel implements ITrack {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(partial: Partial<TrackModel>) {
    Object.assign(this, partial);
  }
}
