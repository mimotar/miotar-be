import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [PrismaService, LoggerService],
})
export class ServicesModule {}
