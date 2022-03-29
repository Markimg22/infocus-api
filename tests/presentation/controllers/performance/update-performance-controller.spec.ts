import { LoadPerformance } from '@/domain/usecases'
import { ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class UpdatePerformanceController implements Controller {
  constructor(
    private readonly updatePerformance: UpdatePerformance
  ) {}

  async handle(request: UpdatePerformanceController.Request): Promise<HttpResponse> {
    try {
      const performanceUpdated = await this.updatePerformance.update(request)
      return ok(performanceUpdated)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

namespace UpdatePerformanceController {
  export type Request = UpdatePerformance.Params
}

interface UpdatePerformance {
  update: (params: UpdatePerformance.Params) => Promise<UpdatePerformance.Result>
}

namespace UpdatePerformance {
  export type Params = {
    userId: string,
    field: 'totalWorkTime' | 'totalRestTime' | 'totalTasksFinished',
    value: number
  }

  export type Result = LoadPerformance.Result
}

class UpdatePerformanceSpy implements UpdatePerformance {
  params = {}
  result = {
    totalRestTime: faker.datatype.number(),
    totalWorkTime: faker.datatype.number(),
    totalTasksFinished: faker.datatype.number()
  } as UpdatePerformance.Result

  async update(params: UpdatePerformance.Params): Promise<UpdatePerformance.Result> {
    this.params = params
    return this.result
  }
}

const mockRequest = (): UpdatePerformanceController.Request => ({
  userId: faker.datatype.uuid(),
  field: 'totalRestTime',
  value: faker.datatype.number()
})

type SutTypes = {
  sut: UpdatePerformanceController,
  updatePerformanceSpy: UpdatePerformanceSpy
}

const makeSut = (): SutTypes => {
  const updatePerformanceSpy = new UpdatePerformanceSpy()
  const sut = new UpdatePerformanceController(updatePerformanceSpy)
  return {
    sut,
    updatePerformanceSpy
  }
}

describe('UpdatePerformance Controller', () => {
  it('should call UpdatePerformance with correct values', async () => {
    const { sut, updatePerformanceSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(updatePerformanceSpy.params).toEqual(request)
  })

  it('should return 500 if UpdatePerformance throws', async () => {
    const { sut, updatePerformanceSpy } = makeSut()
    jest.spyOn(updatePerformanceSpy, 'update').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, updatePerformanceSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(updatePerformanceSpy.result))
  })
})
