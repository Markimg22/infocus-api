import { LoadPerformance } from '@/domain/usecases'

import faker from '@faker-js/faker'

export class LoadPerformanceSpy implements LoadPerformance {
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
