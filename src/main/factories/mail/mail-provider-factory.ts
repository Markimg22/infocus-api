import { MailProvider } from '@/data/protocols/mail';
import { NodemailerMailProvider } from '@/infra/mail';

export const makeMailProvider = (): MailProvider => {
  return new NodemailerMailProvider();
};
