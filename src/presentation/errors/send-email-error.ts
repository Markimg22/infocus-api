export class SendEmailError extends Error {
  constructor() {
    super('Send email error');
    this.name = 'SendEmailError';
  }
}
