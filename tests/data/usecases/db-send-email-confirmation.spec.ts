import { DbSendEmailConfirmation } from '@/data/usecases';
import { MailProvider } from '@/data/protocols/mail';

import {
  mockMailOptions,
  mockSendEmailConfirmationParams,
  throwError,
} from '@/tests/domain/mocks';
import { MailProviderSpy } from '@/tests/data/mocks';

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
    await sut.send(mockSendEmailConfirmationParams());
    expect(mailProviderSpy.options).toEqual({
      host: mailOptions.host,
      port: mailOptions.port,
      username: mailOptions.username,
      password: mailOptions.password,
      from: mailOptions.from,
      subject: mailOptions.subject,
      text: mailOptions.text,
      to: expect.any(String),
      html: expect.any(String),
    });
  });

  it('should throws if MailProvider throws', async () => {
    const { sut, mailProviderSpy } = makeSut();
    jest.spyOn(mailProviderSpy, 'send').mockImplementationOnce(throwError);
    const promise = sut.send(mockSendEmailConfirmationParams());
    await expect(promise).rejects.toThrow();
  });

  it('should return true if MailProvider returns true', async () => {
    const { sut } = makeSut();
    const result = await sut.send(mockSendEmailConfirmationParams());
    expect(result).toBe(true);
  });

  it('should return error message if MailProvider returns false', async () => {
    const { sut, mailProviderSpy } = makeSut();
    mailProviderSpy.result = false;
    const result = await sut.send(mockSendEmailConfirmationParams());
    expect(result).toBe(false);
  });
});
