import { MailProvider } from '@/data/protocols/mail';
import { SendEmailConfirmation } from '@/domain/usecases';
import { env } from '@/main/config/env';

export class DbSendEmailConfirmation implements SendEmailConfirmation {
  constructor(
    private readonly mailProvider: MailProvider,
    private readonly mailOptions: MailProvider.Options
  ) {}

  async send(
    params: SendEmailConfirmation.Params
  ): Promise<SendEmailConfirmation.Result> {
    const greetings = `Hello <b>${params.name}</b>!`;
    const options: MailProvider.Options = {
      ...this.mailOptions,
      to: `${params.name} <${params.email}>`,
      html: `<h2>${greetings}</h2><br/>
      ${this.mailOptions.html}<br/>
      <a href=${`${env.apiUrl}/confirmation-email/${params.id}`}>Click here to confirmation e-mail!</a>`,
    };
    const emailSent = await this.mailProvider.send(options);
    return emailSent;
  }
}
