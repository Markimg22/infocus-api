import { DbConfirmationEmail } from '@/data/usecases';

import { throwError } from '@/tests/domain/mocks';
import {
  CheckUserByIdRepositorySpy,
  UpdateUserEmailConfirmatedRepositorySpy,
} from '@/tests/data/mocks';

import faker from '@faker-js/faker';

type SutTypes = {
  sut: DbConfirmationEmail;
  checkUserByIdRepositorySpy: CheckUserByIdRepositorySpy;
  updateUserEmailConfirmatedRepositorySpy: UpdateUserEmailConfirmatedRepositorySpy;
};

const makeSut = (): SutTypes => {
  const checkUserByIdRepositorySpy = new CheckUserByIdRepositorySpy();
  const updateUserEmailConfirmatedRepositorySpy =
    new UpdateUserEmailConfirmatedRepositorySpy();
  const sut = new DbConfirmationEmail(
    checkUserByIdRepositorySpy,
    updateUserEmailConfirmatedRepositorySpy
  );
  return {
    sut,
    checkUserByIdRepositorySpy,
    updateUserEmailConfirmatedRepositorySpy,
  };
};

describe('DbConfirmationEmail UseCase', () => {
  it('should call LoadUserByIdRepository with correct code', async () => {
    const { sut, checkUserByIdRepositorySpy } = makeSut();
    const confirmationCode = faker.datatype.uuid();
    await sut.confirm(confirmationCode);
    expect(checkUserByIdRepositorySpy.confirmationCode).toEqual(
      confirmationCode
    );
  });

  it('should throws if LoadUserByConfirmationCodeRepository throws', async () => {
    const { sut, checkUserByIdRepositorySpy } = makeSut();
    jest
      .spyOn(checkUserByIdRepositorySpy, 'load')
      .mockImplementationOnce(throwError);
    const promise = sut.confirm(faker.datatype.uuid());
    await expect(promise).rejects.toThrow();
  });

  it('should call UpdateUserEmailConfirmatedRepository with correct values', async () => {
    const { sut, updateUserEmailConfirmatedRepositorySpy } = makeSut();
    const fakerUserId = faker.datatype.uuid();
    await sut.confirm(fakerUserId);
    expect(updateUserEmailConfirmatedRepositorySpy.data).toEqual({
      id: fakerUserId,
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
