import { MailProvider } from '@/data/protocols/mail';

import { mockMailOptions, throwError } from '@/tests/domain/mocks';
import faker from '@faker-js/faker';

class DbSendEmailConfirmation implements SendEmailConfirmation {
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

export interface SendEmailConfirmation {
  send: (
    params: SendEmailConfirmation.Params
  ) => Promise<SendEmailConfirmation.Result>;
}

export namespace SendEmailConfirmation {
  export type Params = {
    name: string;
    email: string;
  };

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

const mockSendEmailConfirmationParams = (): SendEmailConfirmation.Params => ({
  email: faker.internet.email(),
  name: faker.name.findName(),
});

type SutTypes = {
  sut: DbSendEmailConfirmation;
  mailProviderSpy: MailProviderSpy;
  mailOptions: MailProvider.Options;
};

const makeSut = (): SutTypes => {
  const mailProviderSpy = new MailProviderSpy();
  const mailOptions = mockMailOptions();
  const sut = new DbSendEmailConfirmation(mailProviderSpy, mailOptions);
  return {
    sut,
    mailProviderSpy,
    mailOptions,
  };
};

describe('DbSendEmailConfirmation UseCase', () => {
  it('should call MailProvider with correct options', async () => {
    const { sut, mailProviderSpy, mailOptions } = makeSut();
    const params = mockSendEmailConfirmationParams();
    await sut.send(params);
    expect(mailProviderSpy.options).toEqual({
      ...mailOptions,
      to: `${params.name} <${params.email}>`,
      html: `Hello <b>${params.name}</b>!<br/><br/>${mailOptions.html}`,
    });
  });

  it('should throws if MailProvider throws', async () => {
    const { sut, mailProviderSpy } = makeSut();
    jest.spyOn(mailProviderSpy, 'send').mockImplementationOnce(throwError);
    const promise = sut.send(mockSendEmailConfirmationParams());
    await expect(promise).rejects.toThrow();
  });

  it('should return success message if MailProvider returns true', async () => {
    const { sut } = makeSut();
    const params = mockSendEmailConfirmationParams();
    const result = await sut.send(params);
    expect(result).toEqual({
      message: `A confirmation email has been sent to ${params.email}`,
    });
  });

  it('should return error message if MailProvider returns false', async () => {
    const { sut, mailProviderSpy } = makeSut();
    mailProviderSpy.result = false;
    const result = await sut.send(mockSendEmailConfirmationParams());
    expect(result).toEqual({
      message: 'There was an error sending the confirmation email.',
    });
  });
});
