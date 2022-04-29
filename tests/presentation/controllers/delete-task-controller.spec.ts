import { DeleteTaskController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { serverError, ok } from '@/presentation/helpers';
import { LoadTasksSpy, DeleteTaskSpy } from '@/tests/presentation/mocks';

import faker from '@faker-js/faker';

const mockRequest = (): DeleteTaskController.Request => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: DeleteTaskController;
  deleteTaskSpy: DeleteTaskSpy;
  loadTasksSpy: LoadTasksSpy;
};

const makeSut = (): SutTypes => {
  const deleteTaskSpy = new DeleteTaskSpy();
  const loadTasksSpy = new LoadTasksSpy();
  const sut = new DeleteTaskController(deleteTaskSpy, loadTasksSpy);
  return {
    sut,
    deleteTaskSpy,
    loadTasksSpy,
  };
};

describe('DeleteTask Controller', () => {
  it('should call DeleteTask with correct values', async () => {
    const { sut, deleteTaskSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(deleteTaskSpy.params).toEqual(request);
  });

  it('should return 500 if DeleteTask throws', async () => {
    const { sut, deleteTaskSpy } = makeSut();
    jest.spyOn(deleteTaskSpy, 'delete').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

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
