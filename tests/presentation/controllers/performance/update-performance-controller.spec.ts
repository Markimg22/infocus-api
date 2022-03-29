import faker from '@faker-js/faker'

class UpdatePerformanceController {
  constructor(
    private readonly updatePerformance: UpdatePerformance
  ) {}

  async handle(request: UpdatePerformanceController.Request): Promise<void> {
    await this.updatePerformance.update(request)
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
})
