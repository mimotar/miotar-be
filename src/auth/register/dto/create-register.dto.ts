import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  password_confirmation: string;
}
