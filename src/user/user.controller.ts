import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Render,
} from '@nestjs/common';
import { Body, Put, Query } from '@nestjs/common/decorators';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto, ResetPasswordUserDto } from './dto';
import { UserService } from './user.service';
import { SendForgotPasswordEmailService } from 'src/mail/services/send-forgot-password-email.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private emailService: SendForgotPasswordEmailService,
    private config: ConfigService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  getUser(@GetUser() user: Users) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Put('')
  @HttpCode(HttpStatus.OK)
  update(@GetUser('id') id: number, @Body() data: EditUserDto) {
    return this.userService.update(id, data);
  }

  @Post('/send-email-reset-password')
  sendEmail(@Body() data: ResetPasswordUserDto) {
    return this.emailService.execute(data);
  }

  @Get('/reset-password')
  @Render('reset_password')
  pageRegetPassword(@Query('token') token: string) {
    console.log(token);
    return { url: this.config.get('APP_WEB_URL'), token: token };
  }

  @Post('/action/reset')
  updateResetPassword(@Body() data) {
    return this.userService.resetPassword(data?.token, data?.password);
  }
}
