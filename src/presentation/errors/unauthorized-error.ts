export class UnauthrorizedError extends Error {
  constructor() {
    super('Unauthrorized');
    this.name = 'UnauthrorizedError';
  }
}
