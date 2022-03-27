import { throwError } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'

class DbLoadPerformance {
  constructor(
    private readonly loadPerformanceRepository: LoadPerformanceRepository
  ) {}

  async load(userId: string): Promise<void> {
    await this.loadPerformanceRepository.load(userId)
  }
}

interface LoadPerformanceRepository {
  load: (userId: string) => Promise<void>
}

class LoadPerformanceRepositorySpy implements LoadPerformanceRepository {
  userId = ''

  async load(userId: string): Promise<void> {
    this.userId = userId
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
    await sut.load(userId)
    expect(loadPerformanceRepositorySpy.userId).toBe(userId)
  })

  it('should throw if LoadPerformanceRepository throws', async () => {
    const { sut, loadPerformanceRepositorySpy } = makeSut()
    jest.spyOn(loadPerformanceRepositorySpy, 'load').mockImplementationOnce(throwError)
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
