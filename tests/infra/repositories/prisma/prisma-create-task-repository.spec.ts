import { PrismaCreateTaskRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';
import {
  mockCreateTaskParams,
  mockCreateUserParams,
  throwError,
} from '@/tests/domain/mocks';

import { Users } from '@prisma/client';

const makeSut = (): PrismaCreateTaskRepository => {
  const sut = new PrismaCreateTaskRepository(client);
  return sut;
};

describe('PrismaCreateTask Repository', () => {
  let user: Users;

  beforeAll(async () => {
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
  });

  afterAll(async () => {
    await client.tasks.deleteMany();
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should create task with correct values', async () => {
    const sut = makeSut();
    const createTaskParams = mockCreateTaskParams(user.id);
    await sut.create(createTaskParams);
    const task = await client.tasks.findFirst({ where: { userId: user.id } });
    expect(task?.title).toBe(createTaskParams.title);
    expect(task?.description).toBe(createTaskParams.description);
    expect(task?.finished).toBe(createTaskParams.finished);
    expect(task?.userId).toBe(createTaskParams.userId);
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.tasks, 'create').mockImplementationOnce(throwError);
    const promise = sut.create(mockCreateTaskParams(user.id));
    await expect(promise).rejects.toThrow();
  });
});
