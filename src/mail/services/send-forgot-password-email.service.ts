import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SendForgotPasswordEmailService {

  constructor(
    private prisma: PrismaService
  ) {}

  public async execute({ email }: IRequest): Promise<void> {

    const user = await userRepository.findByEmail(email);
    if(!user) {
      throw new AppError('User not found!', 404);
    }
    
    const { token } = await userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: { 
          name: user.name, 
          email: user.email
        },
        subject: "[API Vendas] Recuperição de Senha",
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

    await EtherealMail.sendMail({
      to: { 
        name: user.name, 
        email: user.email
      },
      subject: "[API Vendas] Recuperição de Senha",
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
