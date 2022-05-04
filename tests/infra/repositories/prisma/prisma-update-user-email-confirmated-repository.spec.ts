import { PrismaUpdateUserEmailConfirmatedRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';

import { mockCreateUserParams, throwError } from '@/tests/domain/mocks';

import { Users } from '@prisma/client';

const makeSut = (): PrismaUpdateUserEmailConfirmatedRepository => {
  const sut = new PrismaUpdateUserEmailConfirmatedRepository(client);
  return sut;
};

describe('PrismaUpdateUserEmailConfirmated Repository', () => {
  let user: Users;

  beforeAll(async () => {
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
  });

  afterAll(async () => {
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should update user email confirmated with correct values', async () => {
    const sut = makeSut();
    await sut.update({
      id: user.id,
      emailConfirmated: true,
    });
    const userUpdated = await client.users.findUnique({
      where: { id: user.id },
    });
    expect(userUpdated?.emailConfirmated).toBe(true);
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.users, 'updateMany').mockImplementationOnce(throwError);
    const promise = sut.update({
      id: user.id,
      emailConfirmated: true,
    });
    await expect(promise).rejects.toThrow();
  });

  it('should return true if emailConfirmated updated succeds', async () => {
    const sut = makeSut();
    const emailConfirmatedUpdated = await sut.update({
      id: user.id,
      emailConfirmated: true,
    });
    expect(emailConfirmatedUpdated).toBe(true);
  });
});
