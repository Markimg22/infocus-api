import { DbLoadPerformance } from '@/data/usecases'
import { LoadPerformance } from '@/domain/usecases'
import { makeRepositories } from '@/main/factories'

export const makeDbLoadPerformance = (): LoadPerformance => {
  const { loadPerformanceRepository } = makeRepositories()
  return new DbLoadPerformance(loadPerformanceRepository)
}
