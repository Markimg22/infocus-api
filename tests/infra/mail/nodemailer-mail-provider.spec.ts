import faker from '@faker-js/faker';
import nodemailer from 'nodemailer';

class NodemailerMailProvider implements MailProvider {
  async send(options: MailProvider.Options): Promise<MailProvider.Result> {
    try {
      const tranporter = nodemailer.createTransport({
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          pass: options.password,
        },
      });
      const result = await tranporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      return result !== null;
    } catch (error) {
      return error as Error;
    }
  }
}

interface MailProvider {
  send: (options: MailProvider.Options) => Promise<MailProvider.Result>;
}

namespace MailProvider {
  export type Options = {
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  };

  export type Result = boolean | Error;
}

const mockNodemailer = (): jest.Mocked<typeof nodemailer> => {
  const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
  const sendMailMock = jest.fn().mockReturnValueOnce({});
  // @ts-ignore
  mockedNodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  return mockedNodemailer;
};

const mockMailOptions = (): MailProvider.Options => ({
  host: faker.internet.url(),
  port: faker.datatype.number(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  from: faker.internet.email(),
  to: faker.internet.email(),
  subject: faker.random.word(),
  text: faker.random.word(),
  html: faker.random.word(),
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

  it('should an error if nodemailer throws', async () => {
    const { sut, mockedNodemailer } = makeSut();
    mockedNodemailer.createTransport.mockImplementationOnce(() => {
      throw new Error('Any Error');
    });
    const result = await sut.send(mockMailOptions());
    expect(result).toEqual(new Error('Any Error'));
  });
});
