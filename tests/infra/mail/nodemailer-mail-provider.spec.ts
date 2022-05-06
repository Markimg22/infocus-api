import { NodemailerMailProvider } from '@/infra/mail';

import { mockMailOptions, throwError } from '@/tests/domain/mocks';
import { mockNodemailer } from '@/tests/infra/mocks';

import nodemailer from 'nodemailer';

jest.mock('nodemailer');

type SutTypes = {
  sut: NodemailerMailProvider;
  mockedNodemailer: jest.Mocked<typeof nodemailer>;
};

const makeSut = (): SutTypes => {
  const sut = new NodemailerMailProvider();
  const mockedNodemailer = mockNodemailer();
  return {
    sut,
    mockedNodemailer,
  };
};

describe('NodemailerMailProvider', () => {
  it('should call nodemailer createTransport with correct options', async () => {
    const { sut, mockedNodemailer } = makeSut();
    const createTransportSpy = jest.spyOn(mockedNodemailer, 'createTransport');
    const mailOptions = mockMailOptions();
    await sut.send(mailOptions);
    expect(createTransportSpy).toHaveBeenCalledWith({
      host: mailOptions.host,
      port: mailOptions.port,
      auth: {
        user: mailOptions.username,
        pass: mailOptions.password,
      },
    });
  });

  it('should return true if email sent', async () => {
    const { sut } = makeSut();
    const result = await sut.send(mockMailOptions());
    expect(result).toBe(true);
  });

  it('should return false if nodemailer throws', async () => {
    const { sut, mockedNodemailer } = makeSut();
    mockedNodemailer.createTransport.mockImplementationOnce(throwError);
    const result = await sut.send(mockMailOptions());
    expect(result).toBe(false);
  });
});
