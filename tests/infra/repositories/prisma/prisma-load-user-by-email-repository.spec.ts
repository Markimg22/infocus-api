import { PrismaLoadUserByEmailRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks';

import faker from '@faker-js/faker';

const makeSut = (): PrismaLoadUserByEmailRepository => {
  const sut = new PrismaLoadUserByEmailRepository(client);
  return sut;
};

describe('PrismaLoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await client.$connect();
  });

  afterEach(async () => {
    await client.users.deleteMany();
  });

  afterAll(async () => {
    await client.$disconnect();
  });

  it('should return an user on success', async () => {
    const sut = makeSut();
    const createUserParams = mockCreateUserParams();
    await client.users.create({ data: createUserParams });
    const user = await sut.load(createUserParams.email);
    expect(user).toBeTruthy();
    expect(user?.id).toBeTruthy();
    expect(user?.name).toBe(createUserParams.name);
    expect(user?.password).toBe(createUserParams.password);
  });

  it('should return null if not user found', async () => {
    const sut = makeSut();
    const result = await sut.load(faker.internet.email());
    expect(result).toBeNull();
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.users, 'findUnique').mockImplementationOnce(throwError);
    const promise = sut.load(faker.internet.email());
    await expect(promise).rejects.toThrow();
  });
});
