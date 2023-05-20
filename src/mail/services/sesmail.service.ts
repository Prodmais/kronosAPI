import { Injectable } from '@nestjs/common';
import mailConfig from '../mail';
import { HandlebarsMailTemplateService } from './handlebars-mail-template.service';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';
import IParseMailTemplate from 'src/interfaces/IParseMailTemplate';

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
export class SESMailService {
  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplateService();

    const { email, name, password, host, port } = mailConfig.defaults.from;

    const transporter = nodemailer.createTransport({
      // SES: new aws.SES({
      //   apiVersion: '2022-12-21',
      // }),
      host: host,
      port: port,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const message = await transporter.sendMail({
      from: {
        name: from?.name || name, // ||"Equipe API Vendas",
        address: from?.email || email, // || "equipe@equipe.com.br"
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    });
  }
}
