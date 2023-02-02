import { Exclude } from 'class-transformer';
import { IUser } from '../../../types/types';

export class UserModel implements IUser {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }
}
