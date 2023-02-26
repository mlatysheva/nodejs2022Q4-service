import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  message: string;

  @IsString()
  context: string;

  @IsString()
  level: string;
}
