import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { AlbumEntity } from '../../albums/entities/album.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class FavoritesEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @ManyToMany(() => ArtistEntity, {
    eager: true,
  })
  @JoinTable()
  artists: ArtistEntity[];

  @ManyToMany(() => AlbumEntity, {
    eager: true,
  })
  @JoinTable()
  albums: AlbumEntity[];

  @ManyToMany(() => TrackEntity, {
    eager: true,
  })
  @JoinTable()
  tracks: TrackEntity[];
}
