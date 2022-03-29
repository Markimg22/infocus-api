import { UpdatePerformance } from '@/domain/usecases'

import faker from '@faker-js/faker'

class DbUpdatePerformance implements UpdatePerformance {
  constructor(
    private readonly updatePerformanceRepository: UpdatePerformanceRepository
  ) {}

  async update(params: UpdatePerformance.Params): Promise<UpdatePerformance.Result> {
    await this.updatePerformanceRepository.update(params)
  }
}

interface UpdatePerformanceRepository {
  update: (data: UpdatePerformanceRepository.Params) => Promise<UpdatePerformanceRepository.Result>
}

namespace UpdatePerformanceRepository {
  export type Params = UpdatePerformance.Params
  export type Result = void
}

class UpdatePerformanceRepositorySpy implements UpdatePerformanceRepository {
  data = {}

  async update(data: UpdatePerformanceRepository.Params): Promise<UpdatePerformanceRepository.Result> {
    this.data = data
  }
}

const mockUpdatePerformanceParams = (userId: string): UpdatePerformance.Params => ({
  userId,
  field: 'totalRestTime',
  value: faker.datatype.number()
})

type SutTypes = {
  sut: DbUpdatePerformance,
  updatePerformanceRepositorySpy: UpdatePerformanceRepositorySpy
}

const makeSut = (): SutTypes => {
  const updatePerformanceRepositorySpy = new UpdatePerformanceRepositorySpy()
  const sut = new DbUpdatePerformance(updatePerformanceRepositorySpy)
  return {
    sut,
    updatePerformanceRepositorySpy
  }
}

describe('DbUpdatePerformance UseCase', () => {
  it('should call UpdatePerformanceRepository with correct values', async () => {
    const { sut, updatePerformanceRepositorySpy } = makeSut()
    const updatePerformanceParams = mockUpdatePerformanceParams('any_id')
    await sut.update(updatePerformanceParams)
    expect(updatePerformanceRepositorySpy.data).toEqual(updatePerformanceParams)
  })
})
