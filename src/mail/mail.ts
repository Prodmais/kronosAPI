interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER,
  defaults: {
    from: {
      email: 'equipe@equipe.com.br', // contato@luizdeveloper.cf (Quando um email de envio real for criado)
      name: 'Luiz Victor',
    }
  }
} as IMailConfig