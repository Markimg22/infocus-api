import faker from '@faker-js/faker';
import nodemailer from 'nodemailer';

class NodemailerMailProvider implements MailProvider {
  async send(options: MailProvider.Options): Promise<void> {
    nodemailer.createTransport({
      host: options.host,
      port: options.port,
      auth: {
        user: options.username,
        pass: options.password,
      },
    });
  }
}

interface MailProvider {
  send: (options: MailProvider.Options) => Promise<void>;
}

namespace MailProvider {
  export type Options = {
    host: string;
    port: number;
    username: string;
    password: string;
  };
}

const mockNodemailer = (): jest.Mocked<typeof nodemailer> => {
  const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
  return mockedNodemailer;
};

const mockMailOptions = (): MailProvider.Options => ({
  host: faker.internet.url(),
  port: faker.datatype.number(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

jest.mock('nodemailer');

type SutTypes = {
  sut: NodemailerMailProvider;
  mockedNodemailer: jest.Mocked<typeof nodemailer>;
};

const makeSut = () => {
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
    const mailOptions = mockMailOptions();
    await sut.send(mailOptions);
    expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
      host: mailOptions.host,
      port: mailOptions.port,
      auth: {
        user: mailOptions.username,
        pass: mailOptions.password,
      },
    });
  });
});
