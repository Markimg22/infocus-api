import { PrismaDeleteTaskRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';
import {
  mockCreateTaskParams,
  mockCreateUserParams,
  throwError,
} from '@/tests/domain/mocks';

import { Tasks, Users } from '@prisma/client';

const makeSut = (): PrismaDeleteTaskRepository => {
  const sut = new PrismaDeleteTaskRepository(client);
  return sut;
};

describe('PrismaDeleteTask Repository', () => {
  let user: Users;
  let task: Tasks;

  beforeEach(async () => {
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
    task = await client.tasks.create({
      data: mockCreateTaskParams(user.id),
    });
  });

  afterAll(async () => {
    await client.tasks.deleteMany();
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should return true if delete task on success', async () => {
    const sut = makeSut();
    const result = await sut.delete({
      id: task.id,
      userId: user.id,
    });
    expect(result).toBe(true);
  });

  it('should return false if delete task fails', async () => {
    const sut = makeSut();
    const result = await sut.delete({
      id: 'invalid_id',
      userId: 'any_user_id',
    });
    expect(result).toBe(false);
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.tasks, 'deleteMany').mockImplementationOnce(throwError);
    const promise = sut.delete({ id: 'any_id', userId: 'any_id' });
    await expect(promise).rejects.toThrow();
  });
});
