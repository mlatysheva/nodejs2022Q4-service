import { Exclude, Transform } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  // @Column()
  // @Exclude()
  // refreshToken: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  @Transform(({ value }) => value.getTime())
  createdAt: number;

  @UpdateDateColumn()
  @Transform(({ value }) => value.getTime())
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
