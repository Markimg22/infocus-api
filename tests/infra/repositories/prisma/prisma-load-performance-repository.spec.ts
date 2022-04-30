import { PrismaLoadPerformanceRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';
import {
  mockCreatePerformanceParams,
  mockCreateUserParams,
  throwError,
} from '@/tests/domain/mocks';

import { Users } from '@prisma/client';

const makeSut = (): PrismaLoadPerformanceRepository => {
  const sut = new PrismaLoadPerformanceRepository(client);
  return sut;
};

describe('PrismaLoadPerformance Repository', () => {
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

  it('should return user performance on success', async () => {
    const sut = makeSut();
    await client.performance.create({
      data: mockCreatePerformanceParams(user.id),
    });
    const performance = await sut.load(user.id);
    expect(performance).toBeTruthy();
  });

  it('should retuns {} if not user found', async () => {
    const sut = makeSut();
    const performance = await sut.load('any_id');
    expect(performance).toEqual({});
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest
      .spyOn(client.performance, 'findFirst')
      .mockImplementationOnce(throwError);
    const promise = sut.load('any_id');
    await expect(promise).rejects.toThrow();
  });
});
