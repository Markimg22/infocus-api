import { throwError } from '@/tests/domain/mocks';
import faker from '@faker-js/faker';

class DbConfirmationEmail {
  constructor(
    private readonly loadUserByConfirmationCodeRepository: LoadUserByConfirmationCodeRepository
  ) {}

  async confirm(code: string): Promise<void> {
    await this.loadUserByConfirmationCodeRepository.load(code);
  }
}

export interface LoadUserByConfirmationCodeRepository {
  load: (code: string) => Promise<void>;
}

class LoadUserByConfirmationCodeRepositorySpy
  implements LoadUserByConfirmationCodeRepository
{
  confirmationCode = '';

  async load(code: string): Promise<void> {
    this.confirmationCode = code;
  }
}

type SutTypes = {
  sut: DbConfirmationEmail;
  loadUserByConfirmationCodeRepositorySpy: LoadUserByConfirmationCodeRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadUserByConfirmationCodeRepositorySpy =
    new LoadUserByConfirmationCodeRepositorySpy();
  const sut = new DbConfirmationEmail(loadUserByConfirmationCodeRepositorySpy);
  return {
    sut,
    loadUserByConfirmationCodeRepositorySpy,
  };
};

describe('DbConfirmationEmail', () => {
  it('should call LoadUserByConfirmationCodeRepository with correct code', async () => {
    const { sut, loadUserByConfirmationCodeRepositorySpy } = makeSut();
    const confirmationCode = faker.datatype.uuid();
    await sut.confirm(confirmationCode);
    expect(loadUserByConfirmationCodeRepositorySpy.confirmationCode).toEqual(
      confirmationCode
    );
  });

  it('should throws if LoadUserByConfirmationCodeRepository throws', async () => {
    const { sut, loadUserByConfirmationCodeRepositorySpy } = makeSut();
    jest
      .spyOn(loadUserByConfirmationCodeRepositorySpy, 'load')
      .mockImplementationOnce(throwError);
    const promise = sut.confirm(faker.datatype.uuid());
    await expect(promise).rejects.toThrow();
  });
});
