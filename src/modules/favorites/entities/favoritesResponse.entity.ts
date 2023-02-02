import { AlbumModel } from '../../albums/entities/album.entity';
import { ArtistModel } from '../../artists/entities/artist.entity';
import { TrackModel } from '../../tracks/entities/track.entity';

export class FavoritesResponse {
  artists: ArtistModel[];
  albums: AlbumModel[];
  tracks: TrackModel[];
}
