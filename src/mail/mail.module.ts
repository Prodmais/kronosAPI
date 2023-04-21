import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { EtherealMailService } from './services/ethereal-mail.service';
import { HandlebarsMailTemplateService } from './services/handlebars-mail-template.service';
import { SendForgotPasswordEmailService } from './services/send-forgot-password-email.service';
import { SESMailService } from './services/sesmail.service';
import { AuthModule } from 'src/auth/auth.module';
import { InviteEmailService } from './services/invite-email.service';

@Module({
  imports: [AuthModule],
  providers: [
    SendForgotPasswordEmailService,
    EtherealMailService,
    HandlebarsMailTemplateService,
    SESMailService,
    UserService,
    InviteEmailService,
  ],
  exports: [SendForgotPasswordEmailService, InviteEmailService],
})
export class MailModule {}
