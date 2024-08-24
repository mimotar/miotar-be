import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { VerificationModule } from './verification/verification.module';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [LoginModule, RegisterModule, VerificationModule, PasswordResetModule],
})
export class AuthModule {}
