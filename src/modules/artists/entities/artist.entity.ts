export class ArtistModel {
  id: string;
  name: string;
  grammy: boolean;

  constructor(partial: Partial<ArtistModel>) {
    Object.assign(this, partial);
  }
}
