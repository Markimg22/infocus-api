export class NotFoundError extends Error {
  constructor() {
    super('Not found error');
    this.name = 'NotFoundError';
  }
}
