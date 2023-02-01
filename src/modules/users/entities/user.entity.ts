import { Exclude } from 'class-transformer';

export class UserModel {
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
