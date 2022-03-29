import { serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class UpdatePerformanceController implements Controller {
  constructor(
    private readonly updatePerformance: UpdatePerformance
  ) {}

  async handle(request: UpdatePerformanceController.Request): Promise<HttpResponse> {
    try {
      await this.updatePerformance.update(request)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

namespace UpdatePerformanceController {
  export type Request = UpdatePerformance.Params
}

interface UpdatePerformance {
  update: (params: UpdatePerformance.Params) => Promise<void>
}

namespace UpdatePerformance {
  export type Params = {
    userId: string,
    field: 'totalWorkTime' | 'totalRestTime' | 'totalTasksFinished',
    value: number
  }
}

class UpdatePerformanceSpy implements UpdatePerformance {
  params = {}

  async update(params: UpdatePerformance.Params): Promise<void> {
    this.params = params
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
})
