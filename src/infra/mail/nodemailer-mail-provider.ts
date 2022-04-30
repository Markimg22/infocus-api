import { MailProvider } from '@/data/protocols/mail';

import nodemailer from 'nodemailer';

export class NodemailerMailProvider implements MailProvider {
  async send(options: MailProvider.Options): Promise<MailProvider.Result> {
    try {
      const tranporter = nodemailer.createTransport({
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          pass: options.password,
        },
      });
      const result = await tranporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      return result !== null;
    } catch (error) {
      return error as Error;
    }
  }
}
