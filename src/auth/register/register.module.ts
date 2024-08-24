import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from 'src/services/mailer/mailer.service';
import { CodeGeneratorService } from 'src/services/code-generator/code-generator.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, MailerService, CodeGeneratorService],
})
export class RegisterModule {}
