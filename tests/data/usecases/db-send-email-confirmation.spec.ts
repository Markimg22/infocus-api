import { MailProvider } from '@/data/protocols/mail';

import { mockMailOptions, throwError } from '@/tests/domain/mocks';

class DbSendEmailConfirmation {
  constructor(private readonly mailProvider: MailProvider) {}

  async send(
    params: MailProvider.Options
  ): Promise<SendEmailConfirmation.Result> {
    const emailSent = await this.mailProvider.send(params);
    if (emailSent) {
      return {
        message: `A confirmation email has been sent to ${params.to}`,
      };
    }
    return {
      message: 'There was an error sending the confirmation email.',
    };
  }
}

export interface SendEmailConfirmation {
  send: (
    params: SendEmailConfirmation.Params
  ) => Promise<SendEmailConfirmation.Result>;
}

export namespace SendEmailConfirmation {
  export type Params = MailProvider.Options;

  export type Result = {
    message: string;
  };
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

  it('should throws if MailProvider throws', async () => {
    const { sut, mailProviderSpy } = makeSut();
    jest.spyOn(mailProviderSpy, 'send').mockImplementationOnce(throwError);
    const promise = sut.send(mockMailOptions());
    await expect(promise).rejects.toThrow();
  });

  it('should return success message if MailProvider returns true', async () => {
    const { sut } = makeSut();
    const mailOptions = mockMailOptions();
    const result = await sut.send(mailOptions);
    expect(result).toEqual({
      message: `A confirmation email has been sent to ${mailOptions.to}`,
    });
  });
});
