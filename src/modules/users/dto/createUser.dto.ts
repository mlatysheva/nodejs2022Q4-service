import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'User login must be a string' })
  @IsNotEmpty({ message: 'User login may not be empty' })
  login: string;

  @IsString({ message: 'User password must be a string' })
  @IsNotEmpty({ message: 'User password may not be empty' })
  password: string;
}
