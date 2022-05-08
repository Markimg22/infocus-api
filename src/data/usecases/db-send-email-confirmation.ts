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
    if (emailSent) {
      return {
        message: `A confirmation email has been sent to ${params.email}`,
      };
    }
    return {
      message: 'There was an error sending the confirmation email.',
    };
  }
}
