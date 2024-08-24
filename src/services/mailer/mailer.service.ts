import { Injectable } from '@nestjs/common';
import { MailerService as MailerMailService } from '@nestjs-modules/mailer';
import { PasswordResetToken, User } from '@prisma/client';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailerMailService) {}

  //////////////////////////////////////////////////////////////////////////////// AUTH EMAILS  ///////////////////////////////////////
  async sendVerificationMail(email: string, user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your account!',
      template: 'auth/verification',
      context: {
        user,
      },
    });
  }

  async sendForgotPasswordMail(
    email: string,
    passwordResetToken: PasswordResetToken,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password!',
      template: 'auth/forgot-password',
      context: {
        passwordResetToken,
        link: `${process.env.FRONT_END_URL}/forgot-password/${passwordResetToken.token}?email=${passwordResetToken.email}&expire_at=${new Date(passwordResetToken.expireAt).toISOString()}`,
      },
    });
  }

  async sendResetPasswordSuccessfulMail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your password has changed!',
      template: 'auth/reset-password-successful',
      context: {},
    });
  }

  //////////////////////////////////////////////////////////////////////////////// ACCOUNT EMAILS  ///////////////////////////////////////
}
