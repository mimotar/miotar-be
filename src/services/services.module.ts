import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';
import { CodeGeneratorService } from './code-generator/code-generator.service';

@Module({
  imports: [PrismaModule, LoggerModule, MailerModule],
  providers: [PrismaService, LoggerService, MailerService, CodeGeneratorService],
})
export class ServicesModule {}
