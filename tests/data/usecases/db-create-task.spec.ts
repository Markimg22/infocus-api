import { DbCreateTask } from '@/data/usecases';
import { throwError, mockCreateTaskParams } from '@/tests/domain/mocks';
import { CreateTaskRepositorySpy } from '@/tests/data/mocks';

import faker from '@faker-js/faker';

type SutTypes = {
  sut: DbCreateTask;
  createTaskRepositorySpy: CreateTaskRepositorySpy;
};

const makeSut = (): SutTypes => {
  const createTaskRepositorySpy = new CreateTaskRepositorySpy();
  const sut = new DbCreateTask(createTaskRepositorySpy);
  return {
    sut,
    createTaskRepositorySpy,
  };
};

describe('DbCreateTask UseCase', () => {
  it('should call CreateTaskRepository with correct values', async () => {
    const { sut, createTaskRepositorySpy } = makeSut();
    const createTaskParams = mockCreateTaskParams(faker.datatype.uuid());
    await sut.create(createTaskParams);
    expect(createTaskRepositorySpy.params).toEqual(createTaskParams);
  });

  it('should throws if CreateTaskRepository throws', async () => {
    const { sut, createTaskRepositorySpy } = makeSut();
    jest
      .spyOn(createTaskRepositorySpy, 'create')
      .mockImplementationOnce(throwError);
    const promise = sut.create(mockCreateTaskParams(faker.datatype.uuid()));
    await expect(promise).rejects.toThrow();
  });
});
