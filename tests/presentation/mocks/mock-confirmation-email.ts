import { ConfirmationEmail } from '@/domain/usecases';

export class ConfirmationEmailSpy implements ConfirmationEmail {
  confirmationCode = '';
  result = {
    message: 'E-mail successfully confirmed.',
  };

  async confirm(code: string): Promise<ConfirmationEmail.Result> {
    this.confirmationCode = code;
    return this.result;
  }
}
