import { MailProvider } from '@/data/protocols/mail';
import { SendEmailConfirmation } from '@/domain/usecases';

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
      html: `${greetings}<br/><br/>${this.mailOptions.html}`,
    };
    const emailSent = await this.mailProvider.send(options);
    return emailSent;
  }
}
