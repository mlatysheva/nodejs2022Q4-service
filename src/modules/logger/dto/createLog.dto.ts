import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  context: string;

  @IsString()
  level: string;
}
