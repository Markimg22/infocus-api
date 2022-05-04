import { throwError } from '@/tests/domain/mocks';
import faker from '@faker-js/faker';

class DbConfirmationEmail {
  constructor(
    private readonly loadUserByConfirmationCodeRepository: LoadUserByConfirmationCodeRepository,
    private readonly updateUserEmailConfirmatedRepository: UpdateUserEmailConfirmatedRepository
  ) {}

  async confirm(code: string): Promise<void> {
    const user = await this.loadUserByConfirmationCodeRepository.load(code);
    await this.updateUserEmailConfirmatedRepository.update({
      id: user.id,
      emailConfirmated: true,
    });
  }
}

export interface UpdateUserEmailConfirmatedRepository {
  update: (data: UpdateUserEmailConfirmatedRepository.Params) => Promise<void>;
}

export namespace UpdateUserEmailConfirmatedRepository {
  export type Params = {
    id: string;
    emailConfirmated: boolean;
  };
}

class UpdateUserEmailConfirmatedRepositorySpy
  implements UpdateUserEmailConfirmatedRepository
{
  data: UpdateUserEmailConfirmatedRepository.Params = {
    id: faker.datatype.uuid(),
    emailConfirmated: true,
  };

  async update(
    data: UpdateUserEmailConfirmatedRepository.Params
  ): Promise<void> {
    this.data = data;
  }
}

export interface LoadUserByConfirmationCodeRepository {
  load: (code: string) => Promise<LoadUserByConfirmationCodeRepository.Result>;
}

export namespace LoadUserByConfirmationCodeRepository {
  export type Result = {
    id: string;
  };
}

class LoadUserByConfirmationCodeRepositorySpy
  implements LoadUserByConfirmationCodeRepository
{
  confirmationCode = '';
  result = {
    id: faker.datatype.uuid(),
  };

  async load(
    code: string
  ): Promise<LoadUserByConfirmationCodeRepository.Result> {
    this.confirmationCode = code;
    return this.result;
  }
}

type SutTypes = {
  sut: DbConfirmationEmail;
  loadUserByConfirmationCodeRepositorySpy: LoadUserByConfirmationCodeRepositorySpy;
  updateUserEmailConfirmatedRepositorySpy: UpdateUserEmailConfirmatedRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadUserByConfirmationCodeRepositorySpy =
    new LoadUserByConfirmationCodeRepositorySpy();
  const updateUserEmailConfirmatedRepositorySpy =
    new UpdateUserEmailConfirmatedRepositorySpy();
  const sut = new DbConfirmationEmail(
    loadUserByConfirmationCodeRepositorySpy,
    updateUserEmailConfirmatedRepositorySpy
  );
  return {
    sut,
    loadUserByConfirmationCodeRepositorySpy,
    updateUserEmailConfirmatedRepositorySpy,
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

  it('should call UpdateUserEmailConfirmatedRepository with correct values', async () => {
    const {
      sut,
      loadUserByConfirmationCodeRepositorySpy,
      updateUserEmailConfirmatedRepositorySpy,
    } = makeSut();
    await sut.confirm(faker.datatype.uuid());
    expect(updateUserEmailConfirmatedRepositorySpy.data).toEqual({
      id: loadUserByConfirmationCodeRepositorySpy.result.id,
      emailConfirmated: true,
    });
  });
});
