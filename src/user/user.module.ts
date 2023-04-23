import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MailModule, JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
