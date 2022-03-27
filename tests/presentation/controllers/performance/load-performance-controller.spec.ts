import faker from '@faker-js/faker'

class LoadPerformanceController {
  constructor(
    private readonly loadPerformance: LoadPerformance
  ) {}

  async handle(request: LoadPerformanceController.Request): Promise<void> {
    await this.loadPerformance.load(request.userId)
  }
}

namespace LoadPerformanceController {
  export type Request = {
    userId: string
  }
}

interface LoadPerformance {
  load: (userId: string) => Promise<void>
}

class LoadPerformanceSpy implements LoadPerformance {
  userId = ''

  async load(userId: string): Promise<void> {
    this.userId = userId
  }
}

const mockRequest = (): LoadPerformanceController.Request => ({
  userId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadPerformanceController,
  loadPerformanceSpy: LoadPerformanceSpy
}

const makeSut = (): SutTypes => {
  const loadPerformanceSpy = new LoadPerformanceSpy()
  const sut = new LoadPerformanceController(loadPerformanceSpy)
  return {
    sut,
    loadPerformanceSpy
  }
}

describe('LoadPerformance Controller', () => {
  it('should call LoadPerformance with correct userId', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadPerformanceSpy.userId).toBe(request.userId)
  })
})
