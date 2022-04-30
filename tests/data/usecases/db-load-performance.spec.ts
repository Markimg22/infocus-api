import { DbLoadPerformance } from '@/data/usecases';
import { throwError } from '@/tests/domain/mocks';
import { LoadPerformanceRepositorySpy } from '@/tests/data/mocks';

import faker from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadPerformance;
  loadPerformanceRepositorySpy: LoadPerformanceRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadPerformanceRepositorySpy = new LoadPerformanceRepositorySpy();
  const sut = new DbLoadPerformance(loadPerformanceRepositorySpy);
  return {
    sut,
    loadPerformanceRepositorySpy,
  };
};

describe('DbLoadPerformance UseCase', () => {
  it('should call LoadPerformanceRepository with correct userId', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut();
    const userId = faker.datatype.uuid();
    await sut.loadByUserId(userId);
    expect(loadPerformanceRepositorySpy.userId).toBe(userId);
  });

  it('should throw if LoadPerformanceRepository throws', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut();
    jest
      .spyOn(loadPerformanceRepositorySpy, 'load')
      .mockImplementationOnce(throwError);
    const promise = sut.loadByUserId('any_id');
    await expect(promise).rejects.toThrow();
  });

  it('should return user performance on success', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut();
    const result = await sut.loadByUserId('any_id');
    expect(result).toEqual(loadPerformanceRepositorySpy.result);
  });
});
