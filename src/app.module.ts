import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

import { SendForgotPasswordEmailService } from './mail/services/send-forgot-password-email.service';
import { EtherealMailService } from './mail/services/ethereal-mail.service';
import { HandlebarsMailTemplateService } from './mail/services/handlebars-mail-template.service';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ProjectModule,
  ],
  providers: [SendForgotPasswordEmailService, EtherealMailService, HandlebarsMailTemplateService],
})
export class AppModule {}
