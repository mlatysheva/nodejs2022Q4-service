import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IArtist } from '../../../types/types';

@Entity('artist')
export class ArtistEntity implements IArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  constructor(partial: Partial<ArtistEntity>) {
    Object.assign(this, partial);
  }
}
