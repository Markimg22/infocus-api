import { LoadPerformance } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'

class DbLoadPerformance implements LoadPerformance {
  constructor(
    private readonly loadPerformanceRepository: LoadPerformanceRepository
  ) {}

  async loadByUserId(userId: string): Promise<LoadPerformance.Result> {
    const performance = await this.loadPerformanceRepository.load(userId)
    return performance
  }
}

interface LoadPerformanceRepository {
  load: (userId: string) => Promise<LoadPerformanceRepository.Result>
}

namespace LoadPerformanceRepository {
  export type Result = LoadPerformance.Result
}

class LoadPerformanceRepositorySpy implements LoadPerformanceRepository {
  userId = ''
  result = {
    totalRestTime: faker.datatype.number(),
    totalTasksFinished: faker.datatype.number(),
    totalWorkTime: faker.datatype.number()
  } as LoadPerformanceRepository.Result

  async load(userId: string): Promise<LoadPerformanceRepository.Result> {
    this.userId = userId
    return this.result
  }
}

type SutTypes = {
  sut: DbLoadPerformance,
  loadPerformanceRepositorySpy: LoadPerformanceRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadPerformanceRepositorySpy = new LoadPerformanceRepositorySpy()
  const sut = new DbLoadPerformance(loadPerformanceRepositorySpy)
  return {
    sut,
    loadPerformanceRepositorySpy
  }
}

describe('DbLoadPerformance UseCase', () => {
  it('should call LoadPerformanceRepository with correct userId', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut()
    const userId = faker.datatype.uuid()
    await sut.loadByUserId(userId)
    expect(loadPerformanceRepositorySpy.userId).toBe(userId)
  })

  it('should throw if LoadPerformanceRepository throws', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut()
    jest.spyOn(loadPerformanceRepositorySpy, 'load').mockImplementationOnce(throwError)
    const promise = sut.loadByUserId('any_id')
    await expect(promise).rejects.toThrow()
  })

  it('should return user performance on success', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut()
    const result = await sut.loadByUserId('any_id')
    expect(result).toEqual(loadPerformanceRepositorySpy.result)
  })
})
