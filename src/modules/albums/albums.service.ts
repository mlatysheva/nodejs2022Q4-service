import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { AlbumEntity } from './entities/album.entity';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistsService } from '../artists/artists.service';
import { ErrorMessage } from '../../constants/errors';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>,
    private artistsService: ArtistsService,
  ) {}

  private logger = new Logger(AlbumsService.name);

  getAll = async (): Promise<AlbumEntity[]> => {
    this.logger.log('Getting all albums');
    return await this.albumsRepository.find();
  };

  getOne = async (id: string): Promise<AlbumEntity> => {
    this.logger.log(`Getting album ${id}`);
    return await this.albumsRepository.findOneBy({ id });
  };

  create = async (albumData: CreateAlbumDto): Promise<AlbumEntity> => {
    if (albumData.artistId) {
      const artist = await this.artistsService.getOne(albumData.artistId);
      if (!artist) {
        albumData.artistId = null;
      }
    }
    const newAlbum: AlbumEntity = {
      artist: null,
      ...albumData,
      id: uuid(),
    };
    this.logger.log(`Creating album ${newAlbum.id}`);
    const createdAlbum = this.albumsRepository.create(newAlbum);
    return await this.albumsRepository.save(createdAlbum);
  };

  update = async (id: string, albumData: UpdateAlbumDto) => {
    const album = await this.albumsRepository.findOneBy({ id });
    if (album) {
      const updatedAlbum = {
        ...album,
        ...albumData,
        id: id,
      };

      this.logger.log(`Updating album ${id}`);
      await this.albumsRepository.update({ id }, updatedAlbum);
      const result = await this.albumsRepository.findOneBy({ id });
      this.logger.log(
        `result of updating artist is ${id} ${result.id}, ${result.name}, ${result.year}, ${result.artist}, ${result.artistId}`,
      );
    } else {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
  };

  delete = async (id: string): Promise<boolean> => {
    this.logger.log(`Deleting album ${id}`);
    // await this.tracksService.removeAlbumId(id);
    // await this.favoritesService.removeAlbum(id);
    const result = await this.albumsRepository.delete({ id });
    if (result) {
      return true;
    } else return false;
  };

  removeArtistId = async (id: string): Promise<void> => {
    // await AlbumsService.albums.setIdToNull(id, 'artistId');
  };
}
