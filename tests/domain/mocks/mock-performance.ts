import { CreatePerformanceRepository } from '@/data/protocols/repositories'

export const mockCreatePerformanceParams = (userId: string): CreatePerformanceRepository.Params => ({
  userId
})
