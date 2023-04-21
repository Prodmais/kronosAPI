import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { EtherealMailService } from './services/ethereal-mail.service';
import { HandlebarsMailTemplateService } from './services/handlebars-mail-template.service';
import { SendForgotPasswordEmailService } from './services/send-forgot-password-email.service';
import { SESMailService } from './services/sesmail.service';

@Module({
  providers: [
    SendForgotPasswordEmailService,
    EtherealMailService,
    HandlebarsMailTemplateService,
    SESMailService,
    UserService,
  ],
})
export class MailModule {}
