import { MailProvider } from '@/data/protocols/mail';
import { env } from '@/main/config/env';

export const makeEmailConfirmationOptions = (): MailProvider.Options => {
  const from = `InfocusApp© | < ${env.mailFrom} >`;
  const to = '';
  const html = '';
  return {
    host: env.mailHost,
    port: env.mailPort,
    username: env.mailUsername,
    password: env.mailPassword,
    to,
    from,
    subject: 'InfocusApp© | Confirm Email',
    text: 'Please confirm your email.',
    html,
  };
};
