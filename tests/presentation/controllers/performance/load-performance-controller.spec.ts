import { ok, serverError } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class LoadPerformanceController {
  constructor(
    private readonly loadPerformance: LoadPerformance
  ) {}

  async handle(request: LoadPerformanceController.Request): Promise<HttpResponse> {
    try {
      const performance = await this.loadPerformance.loadByUserId(request.userId)
      return ok(performance)
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
  loadByUserId: (userId: string) => Promise<LoadPerformance.Result>
}

namespace LoadPerformance {
  export type Result = {
    totalWorkTime: number,
    totalRestTime: number,
    totalTasksFinished: number
  }
}

class LoadPerformanceSpy implements LoadPerformance {
  userId = ''
  result = {
    totalRestTime: faker.datatype.number(),
    totalWorkTime: faker.datatype.number(),
    totalTasksFinished: faker.datatype.number()
  } as LoadPerformance.Result

  async loadByUserId(userId: string): Promise<LoadPerformance.Result> {
    this.userId = userId
    return this.result
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
    jest.spyOn(loadPerformanceSpy, 'loadByUserId').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadPerformanceSpy.result))
  })
})
