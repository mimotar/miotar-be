import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [LoginModule, RegisterModule, VerificationModule],
})
export class AuthModule {}
