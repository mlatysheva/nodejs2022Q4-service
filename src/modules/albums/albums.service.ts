import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { AlbumModel } from './entities/album.entity';
import { InMemoryDBService } from '../../database/inMemoryDB.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly albums: InMemoryDBService<AlbumModel>) {}
  private logger = new Logger(AlbumsService.name);

  getAll = async (): Promise<AlbumModel[]> => {
    this.logger.log('Getting all albums');
    return await this.albums.getAll();
  };

  getOne = async (id: string): Promise<AlbumModel> => {
    this.logger.log('Getting the album by id');
    return await this.albums.getOne(id);
  };

  create = async (albumData: CreateAlbumDto): Promise<AlbumModel> => {
    const newAlbum: AlbumModel = {
      ...albumData,
      id: uuid(),
    };
    this.logger.log(`Creating user ${newAlbum.id}`);
    return await this.albums.post(newAlbum);
  };

  update = async (
    id: string,
    albumData: UpdateAlbumDto,
  ): Promise<AlbumModel> => {
    const album = await this.albums.getOne(id);
    if (!album) {
      return null;
    }

    const updatedAlbum = {
      ...album,
      ...albumData,
    };

    this.logger.log(`Updating album ${id}`);
    return await this.albums.update(id, updatedAlbum);
  };

  delete = async (id: string): Promise<boolean> => {
    this.logger.log(`Deleting album ${id}`);
    return await this.albums.delete(id);
  };

  removeArtistIdLink = async (id: string): Promise<void> => {
    await this.albums.removeExternalId(id, 'artistId');
  };
}
