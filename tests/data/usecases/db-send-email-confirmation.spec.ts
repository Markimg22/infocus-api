import { MailProvider } from '@/data/protocols/mail';

import { mockMailOptions } from '@/tests/domain/mocks';

class DbSendEmailConfirmation {
  constructor(private readonly mailProvider: MailProvider) {}

  async send(options: MailProvider.Options): Promise<void> {
    await this.mailProvider.send(options);
  }
}

class MailProviderSpy implements MailProvider {
  options = {} as MailProvider.Options;
  result = true;

  async send(options: MailProvider.Options): Promise<MailProvider.Result> {
    this.options = options;
    return this.result;
  }
}

type SutTypes = {
  sut: DbSendEmailConfirmation;
  mailProviderSpy: MailProviderSpy;
};

const makeSut = (): SutTypes => {
  const mailProviderSpy = new MailProviderSpy();
  const sut = new DbSendEmailConfirmation(mailProviderSpy);
  return {
    sut,
    mailProviderSpy,
  };
};

describe('DbSendEmailConfirmation UseCase', () => {
  it('should call MailProvider with correct options', async () => {
    const { sut, mailProviderSpy } = makeSut();
    const mailOptions = mockMailOptions();
    await sut.send(mailOptions);
    expect(mailProviderSpy.options).toEqual(mailOptions);
  });
});
