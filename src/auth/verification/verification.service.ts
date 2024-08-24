import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from 'src/services/mailer/mailer.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { AccountStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(
    private prismaService: PrismaService,
    private mailerService: MailerService,
  ) {}
  async verify(
    userId: number,
    verifyAccountDto: VerifyAccountDto,
  ): Promise<object> {
    let userResult = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (
      verifyAccountDto.verificationCode !== userResult.profile.verificationCode
    ) {
      throw new BadRequestException(
        'Invalid verification code. Please check and try again.',
      );
    } else if (userResult.profile.status && userResult.profile.emailVerifyAt) {
      return { message: 'Account already verified' };
    }

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            data: {
              status: AccountStatus.ACTIVE,
              emailVerifyAt: new Date(),
            },
          },
        },
      },
      include: {
        profile: {
          omit: {
            verificationCode: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
    return { user };
  }

  async resendMail(userId: number): Promise<object> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (user.profile.status && user.profile.emailVerifyAt) {
      return { message: 'Account already verified' };
    }
    await this.mailerService.sendVerificationEmail(user.email, user);
    return {
      message: 'Verification email sent successfully',
    };
  }
}
