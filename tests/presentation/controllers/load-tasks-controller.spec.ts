import { LoadTasksController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { LoadTasksSpy } from '@/tests/presentation/mocks';
import { serverError, ok } from '@/presentation/helpers';

import faker from '@faker-js/faker';

const mockRequest = (): LoadTasksController.Request => ({
  userId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: LoadTasksController;
  loadTasksSpy: LoadTasksSpy;
};

const makeSut = (): SutTypes => {
  const loadTasksSpy = new LoadTasksSpy();
  const sut = new LoadTasksController(loadTasksSpy);
  return {
    sut,
    loadTasksSpy,
  };
};

describe('LoadTasks Controller', () => {
  it('should call LoadTasks with correct userId', async () => {
    const { sut, loadTasksSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(loadTasksSpy.userId).toBe(request.userId);
  });

  it('should return 500 if LoadTasks throws', async () => {
    const { sut, loadTasksSpy } = makeSut();
    jest.spyOn(loadTasksSpy, 'loadByUserId').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 on success', async () => {
    const { sut, loadTasksSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(loadTasksSpy.result));
  });
});
