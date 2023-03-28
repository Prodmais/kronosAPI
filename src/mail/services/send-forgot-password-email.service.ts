import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { USER_ERROR } from '../../error';
import mailConfig from '../mail';
import path from 'path';
import { EtherealMailService } from './ethereal-mail.service';
import { SESMailService } from './sesmail.service';

interface IRequest {
  email: string;
}

@Injectable()
export class SendForgotPasswordEmailService {

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private etherealMail: EtherealMailService,
    private SESMail: SESMailService

  ) {}

  public async execute({ email }: IRequest): Promise<void> {

    const user = await this.userService.findByEmail(email);
    if(!user) {
      throw new NotFoundException(USER_ERROR.NOT_FOUND);
    }
    
    // const { token } = await userTokensRepository.generate(user.id);
    const token = "token"; // implementar o token do usuário;

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    if (mailConfig.driver === 'ses') {
      await this.SESMail.sendMail({
        to: { 
          name: user.name, 
          email: user.email
        },
        subject: "[Cronos] Recuperação de Senha",
        templateData: {
          file: forgotPasswordTemplate,
          variables: { 
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
            token
          }
        }
      })

      return;
    }

    await this.etherealMail.sendMail({
      to: { 
        name: user.name, 
        email: user.email
      },
      subject: "[Cronos] Recuperação de Senha",
      templateData: {
        file: forgotPasswordTemplate,
        variables: { 
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          token
        }
      }
    })
  }
}
