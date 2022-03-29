import {
  LoadPerformanceRepository,
  CreatePerformanceRepository
} from '@/data/protocols/repositories'

import faker from '@faker-js/faker'

export class LoadPerformanceRepositorySpy implements LoadPerformanceRepository {
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

export class CreatePerformanceRepositorySpy implements CreatePerformanceRepository {
  userId = ''

  async create(data: CreatePerformanceRepository.Params): Promise<void> {
    this.userId = data.userId
  }
}
