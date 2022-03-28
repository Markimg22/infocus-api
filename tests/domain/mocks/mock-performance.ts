import { CreatePerformanceRepository } from '@/data/protocols/repositories'

import faker from '@faker-js/faker'

export const mockCreatePerformanceParams = (userId: string): CreatePerformanceRepository.Params => ({
  userId,
  totalTasksFinished: faker.datatype.number(),
  totalRestTime: faker.datatype.number(),
  totalWorkTime: faker.datatype.number()
})
