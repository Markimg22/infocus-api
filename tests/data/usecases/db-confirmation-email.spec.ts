import { DbConfirmationEmail } from '@/data/usecases';

import { throwError } from '@/tests/domain/mocks';
import {
  LoadUserByConfirmationCodeRepositorySpy,
  UpdateUserEmailConfirmatedRepositorySpy,
} from '@/tests/data/mocks';

import faker from '@faker-js/faker';

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

  it('should throws if UpdateUserEmailConfirmatedRepository throws', async () => {
    const { sut, updateUserEmailConfirmatedRepositorySpy } = makeSut();
    jest
      .spyOn(updateUserEmailConfirmatedRepositorySpy, 'update')
      .mockImplementationOnce(throwError);
    const promise = sut.confirm(faker.datatype.uuid());
    await expect(promise).rejects.toThrow();
  });

  it('should return message succeds if email confirmated on succeds', async () => {
    const { sut } = makeSut();
    const result = await sut.confirm(faker.datatype.uuid());
    expect(result).toEqual({
      message: 'E-mail successfully confirmed.',
    });
  });

  it('should return message fails if email not confirmated', async () => {
    const { sut, updateUserEmailConfirmatedRepositorySpy } = makeSut();
    updateUserEmailConfirmatedRepositorySpy.result = false;
    const result = await sut.confirm(faker.datatype.uuid());
    expect(result).toEqual({
      message: 'The email has not been confirmed.',
    });
  });
});
