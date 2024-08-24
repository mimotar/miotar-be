import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { MailerService } from 'src/services/mailer/mailer.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import { PasswordResetTokenStatusEnum } from '@prisma/client';

@Injectable()
export class PasswordResetService {
  constructor(
    private prismaService: PrismaService,
    private mailerService: MailerService,
  ) {}

  async forgotPassword(
    forgotPasswordAccountDto: ForgotPasswordDto,
  ): Promise<object> {
    try {
      const token = crypto.randomUUID();

      // create password reset token
      const passwordResetToken =
        await this.prismaService.passwordResetToken.create({
          data: {
            email: forgotPasswordAccountDto.email,
            token: token,
            expireAt: new Date(new Date().getTime() + 20 * 60 * 1000),
          },
        });

      //   send forgot password email to user
      await this.mailerService.sendForgotPasswordMail(
        forgotPasswordAccountDto.email,
        passwordResetToken,
      );

      return { message: 'We have emailed your password reset link.' };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const passwordResetToken =
        await this.prismaService.passwordResetToken.findFirstOrThrow({
          where: {
            email: resetPasswordDto.email,
            token: resetPasswordDto.token,
            status: PasswordResetTokenStatusEnum.ACTIVE,
            expireAt: {
              gt: new Date(),
            },
          },
        });

      if (
        resetPasswordDto.password !== resetPasswordDto.password_confirmation
      ) {
        throw new BadRequestException('Passwords do not match');
      }

      //   hash new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, salt);

      //   update password
      await this.prismaService.user.update({
        where: {
          email: passwordResetToken.email,
        },
        data: {
          password: hashedPassword,
        },
      });

      //   update the token status
      await this.prismaService.passwordResetToken.update({
        where: {
          email: resetPasswordDto.email,
          token: resetPasswordDto.token,
        },
        data: {
          status: PasswordResetTokenStatusEnum.INACTIVE,
        },
      });

      //   send alert to use that their password has changed
      await this.mailerService.sendResetPasswordSuccessfulMail(
        resetPasswordDto.email,
      );
      return {
        message: 'Your password has been reset.',
      };
    } catch (error) {
      throw new NotFoundException('Invalid reset password token!');
    }
  }
}
