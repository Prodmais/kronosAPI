interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
      password: string;
      host: string;
      port: number;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER,
  defaults: {
    from: {
      email: process.env.MAIL_EMAIL, // contato@luizdeveloper.cf (Quando um email de envio real for criado)
      name: process.env.MAIL_NAME,
      password: process.env.MAIL_PASSWORD,
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
    },
  },
} as IMailConfig;
