import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import IParseMailTemplate from 'src/interfaces/IParseMailTemplate';
import { HandlebarsMailTemplateService } from './handlebars-mail-template.service';

interface IMailContact {
  name: string;
  email: string;
}

interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

@Injectable()
export class EtherealMailService {

  constructor() {}

  public static async sendMail({ to, from, subject, templateData }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount();
    const mailTemplate = new HandlebarsMailTemplateService()

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });


    const message = await transporter.sendMail({
      from: {
        name: from?.name || "Equipe Cronos",
        address: from?.email || "equipe@equipe.com.br"
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: await mailTemplate.parse(templateData)
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}
