import { PrismaUpdatePerformanceRepository } from '@/infra/repositories';
import { UpdatePerformanceRepository } from '@/data/protocols/repositories';
import { client } from '@/infra/helpers';
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks';

import faker from '@faker-js/faker';
import { Users } from '@prisma/client';

const valueDefault = faker.datatype.number();

const makeSut = (): PrismaUpdatePerformanceRepository => {
  const sut = new PrismaUpdatePerformanceRepository(client);
  return sut;
};

describe('PrismaUpdatePerformance Repository', () => {
  let user: Users;

  beforeAll(async () => {
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
    await client.performance.create({
      data: {
        userId: user.id,
        totalRestTime: valueDefault,
        totalTasksFinished: valueDefault,
        totalWorkTime: valueDefault,
      },
    });
  });

  afterAll(async () => {
    await client.performance.deleteMany();
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should update totalTasksFinished in performance successfully', async () => {
    const sut = makeSut();
    const valueIncrement = faker.datatype.number();
    await sut.update({
      userId: user.id,
      field: 'totalTasksFinished',
      value: valueIncrement,
    });
    const performance = await client.performance.findUnique({
      where: { userId: user.id },
    });
    expect(performance?.totalTasksFinished).toBe(valueDefault + valueIncrement);
  });

  it('should update totalRestTime in performance successfully', async () => {
    const sut = makeSut();
    const valueIncrement = faker.datatype.number();
    await sut.update({
      userId: user.id,
      field: 'totalRestTime',
      value: valueIncrement,
    });
    const performance = await client.performance.findUnique({
      where: { userId: user.id },
    });
    expect(performance?.totalRestTime).toBe(valueDefault + valueIncrement);
  });

  it('should update totalWorkTime in performance successfully', async () => {
    const sut = makeSut();
    const valueIncrement = faker.datatype.number();
    await sut.update({
      userId: user.id,
      field: 'totalWorkTime',
      value: valueIncrement,
    });
    const performance = await client.performance.findUnique({
      where: { userId: user.id },
    });
    expect(performance?.totalWorkTime).toBe(valueDefault + valueIncrement);
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.performance, 'update').mockImplementationOnce(throwError);
    const promise = sut.update({} as UpdatePerformanceRepository.Params);
    await expect(promise).rejects.toThrow();
  });
});
