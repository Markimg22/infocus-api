import { PrismaCreatePerformanceRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';
import {
  mockCreatePerformanceParams,
  mockCreateUserParams,
  throwError,
} from '@/tests/domain/mocks';

import { Users } from '@prisma/client';

const makeSut = (): PrismaCreatePerformanceRepository => {
  const sut = new PrismaCreatePerformanceRepository(client);
  return sut;
};

describe('PrismaCreatePerformance Repository', () => {
  let user: Users;

  beforeAll(async () => {
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
  });

  afterAll(async () => {
    await client.performance.deleteMany();
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should create user performance on success', async () => {
    const sut = makeSut();
    await sut.create(mockCreatePerformanceParams(user.id));
    const performance = await client.performance.findFirst({
      where: { userId: user.id },
    });
    expect(performance).toBeTruthy();
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.performance, 'create').mockImplementationOnce(throwError);
    const promise = sut.create(mockCreatePerformanceParams(user.id));
    await expect(promise).rejects.toThrow();
  });
});
