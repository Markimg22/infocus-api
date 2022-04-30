import nodemailer from 'nodemailer';

export const mockNodemailer = (): jest.Mocked<typeof nodemailer> => {
  const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
  const sendMailMock = jest.fn().mockReturnValueOnce({});
  // @ts-ignore
  mockedNodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  return mockedNodemailer;
};
