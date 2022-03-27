import { LoadPerformanceRepository } from '@/data/protocols/repositories'

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
