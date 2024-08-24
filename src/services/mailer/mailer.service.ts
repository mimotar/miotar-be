import { Injectable } from '@nestjs/common';
import { MailerService as MailerMailService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailerMailService) {}

  async sendVerificationEmail(email: string, user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your account!',
      template: 'verification',
      context: {
        user,
      },
    });
  }
}
