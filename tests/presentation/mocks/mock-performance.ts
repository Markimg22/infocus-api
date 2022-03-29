import { LoadPerformance, UpdatePerformance } from '@/domain/usecases'

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

export class UpdatePerformanceSpy implements UpdatePerformance {
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
