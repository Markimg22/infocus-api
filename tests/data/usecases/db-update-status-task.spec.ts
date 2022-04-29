import { DbUpdateStatusTask } from '@/data/usecases';
import { mockUpdateStatusTaskParams, throwError } from '@/tests/domain/mocks';
import { UpdateStatusTaskRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbUpdateStatusTask;
  updateStatusTaskRepositorySpy: UpdateStatusTaskRepositorySpy;
};

const makeSut = (): SutTypes => {
  const updateStatusTaskRepositorySpy = new UpdateStatusTaskRepositorySpy();
  const sut = new DbUpdateStatusTask(updateStatusTaskRepositorySpy);
  return {
    sut,
    updateStatusTaskRepositorySpy,
  };
};

describe('DbUpdateStatusTask UseCase', () => {
  it('should call UpdateStatusTaskRepository with correct values', async () => {
    const { sut, updateStatusTaskRepositorySpy } = makeSut();
    const updateStatusTaskParams = mockUpdateStatusTaskParams();
    await sut.update(updateStatusTaskParams);
    expect(updateStatusTaskRepositorySpy.data).toEqual(updateStatusTaskParams);
  });

  it('should throws if UpdateStatusTaskRepository throws', async () => {
    const { sut, updateStatusTaskRepositorySpy } = makeSut();
    jest
      .spyOn(updateStatusTaskRepositorySpy, 'update')
      .mockImplementationOnce(throwError);
    const promise = sut.update(mockUpdateStatusTaskParams());
    await expect(promise).rejects.toThrow();
  });

  it('should return true if UpdateStatusTaskRepository returns true', async () => {
    const { sut } = makeSut();
    const result = await sut.update(mockUpdateStatusTaskParams());
    expect(result).toBe(true);
  });

  it('should return false if UpdateStatusTaskRepository returns false', async () => {
    const { sut, updateStatusTaskRepositorySpy } = makeSut();
    updateStatusTaskRepositorySpy.result = false;
    const result = await sut.update(mockUpdateStatusTaskParams());
    expect(result).toBe(false);
  });
});
