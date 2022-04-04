import { DbUpdatePerformance } from '@/data/usecases'
import { UpdatePerformance } from '@/domain/usecases'
import { makeRepositories } from '@/main/factories'

export const makeDbUpdatePerformance = (): UpdatePerformance => {
  const { updatePerformanceRepository } = makeRepositories()
  return new DbUpdatePerformance(updatePerformanceRepository)
}
