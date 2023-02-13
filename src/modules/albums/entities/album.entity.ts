import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IAlbum } from '../../../types/types';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { Exclude } from 'class-transformer';

@Entity('album')
export class AlbumEntity implements IAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'artistId',
    referencedColumnName: 'id',
  })
  artist: string | null;

  constructor(partial: Partial<AlbumEntity>) {
    Object.assign(this, partial);
  }
}
