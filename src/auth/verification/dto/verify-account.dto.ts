import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  verificationCode: string;
}
