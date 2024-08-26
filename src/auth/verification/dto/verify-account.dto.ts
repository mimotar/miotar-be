import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @MinLength(6)
  verificationCode: string;
}
