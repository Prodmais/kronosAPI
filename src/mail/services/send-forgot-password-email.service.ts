import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { USER_ERROR } from '../../error';
import mailConfig from '../mail';
import * as path from 'path';
import { EtherealMailService } from './ethereal-mail.service';
import { SESMailService } from './sesmail.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

interface IRequest {
  email: string;
}

@Injectable()
export class SendForgotPasswordEmailService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private authService: AuthService,
    private etherealMail: EtherealMailService,
    private SESMail: SESMailService,
    private config: ConfigService,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_ERROR.NOT_FOUND);
    }

    const { token } = await this.authService.signToken(user.id, user.email);
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'view',
      'forgot_password.hbs',
    );

    if (mailConfig.driver === 'ses') {
      await this.SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[Cronos] Recuperação de Senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${this.config.get(
              'APP_WEB_URL',
            )}/reset_password?token=${token}`,
            token,
            url: this.config.get('APP_WEB_URL'),
          },
        },
      });

      return;
    }

    await this.etherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Cronos] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${this.config.get(
            'APP_WEB_URL',
          )}/reset_password?token=${token}`,
          token,
          url: this.config.get('APP_WEB_URL'),
        },
      },
    });
  }
}
