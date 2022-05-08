import { MailProvider } from '@/data/protocols/mail';

export class MailProviderSpy implements MailProvider {
  options = {} as MailProvider.Options;
  result = true;

  async send(options: MailProvider.Options): Promise<MailProvider.Result> {
    this.options = options;
    return this.result;
  }
}
