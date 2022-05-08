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
