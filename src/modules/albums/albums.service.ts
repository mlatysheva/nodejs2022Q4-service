import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistsService } from '../artists/artists.service';
import { ErrorMessage } from '../../constants/errors';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsService: Repository<AlbumEntity>,
    private artistsService: ArtistsService,
  ) {}

  checkArtistExists = async (artistId: string) => {
    const artist = await this.artistsService.getOne(artistId);
    if (!artist) {
      return null;
    } else {
      return artistId;
    }
  };
  getAll = async (): Promise<AlbumEntity[]> => {
    return await this.albumsService.find();
  };

  getOne = async (id: string): Promise<AlbumEntity> => {
    return await this.albumsService.findOneBy({ id });
  };

  create = async (albumData: CreateAlbumDto): Promise<AlbumEntity> => {
    if (albumData.artistId) {
      albumData.artistId = await this.checkArtistExists(albumData.artistId);
    }
    const album = this.albumsService.create(albumData);
    return await this.albumsService.save(album);
  };

  update = async (id: string, albumData: UpdateAlbumDto) => {
    if (albumData.artistId) {
      albumData.artistId = await this.checkArtistExists(albumData.artistId);
    }
    const album = await this.albumsService.findOneBy({ id });
    if (album) {
      await this.albumsService.update({ id }, albumData);
      return await this.albumsService.findOneBy({ id });
    } else {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
  };

  delete = async (id: string) => {
    const result = await this.albumsService.delete({ id });
    if (result) {
      return true;
    } else {
      return false;
    }
  };
}
