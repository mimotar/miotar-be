import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
      include: {
        profile: {
          omit: {
            verificationCode: true,
          },
        },
      },
    });

    return { user };
  }
}
