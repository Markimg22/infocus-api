import { serverError } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class LoadPerformanceController {
  constructor(
    private readonly loadPerformance: LoadPerformance
  ) {}

  async handle(request: LoadPerformanceController.Request): Promise<HttpResponse> {
    try {
      await this.loadPerformance.load(request.userId)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError(error as Error)
    }
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

  it('should return 500 if LoadPerformance throws', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    jest.spyOn(loadPerformanceSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
