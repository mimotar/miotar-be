import { Module } from '@nestjs/common';
import { MailerModule as MailerMailModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    MailerMailModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAILER_USERNAME,
          pass: process.env.MAILER_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAILER_FROM_ADDRESS,
      },
      template: {
        dir: process.cwd() + '/src/mails',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
})
export class MailerModule {}
