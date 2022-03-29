import { CreatePerformanceRepository } from '@/data/protocols/repositories'
import { UpdatePerformance } from '@/domain/usecases'

import faker from '@faker-js/faker'

export const mockCreatePerformanceParams = (userId: string): CreatePerformanceRepository.Params => ({
  userId
})

export const mockUpdatePerformanceParams = (userId: string): UpdatePerformance.Params => ({
  userId,
  field: 'totalRestTime',
  value: faker.datatype.number()
})
