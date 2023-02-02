import { IFavorites } from '../../../types/types';

export class FavoritesModel implements IFavorites {
  artists: Array<string>;
  albums: Array<string>;
  tracks: Array<string>;
}
