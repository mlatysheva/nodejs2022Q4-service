import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsUUID()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
}
