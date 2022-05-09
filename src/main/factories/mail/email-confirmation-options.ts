import { MailProvider } from '@/data/protocols/mail';
import { env } from '@/main/config/env';

export const makeEmailConfirmationOptions = (): MailProvider.Options => {
  const from = `InfocusApp© | < ${env.mailFrom} >`;
  const to = '';
  return {
    host: env.mailHost,
    port: Number(env.mailPort),
    username: env.mailUsername,
    password: env.mailPassword,
    to,
    from,
    subject: 'InfocusApp© | Confirm Email',
    text:
      'On behalf of the Infocus App community, very welcome!\n' +
      'Please confirm your email by clicking the link below 👇',
    html: `<p>On behalf of the Infocus App community, very welcome!</p>
    <p>Please confirm your email by clicking the link below 👇</p>`,
  };
};
