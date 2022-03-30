import { LoadPerformanceRepository } from '@/data/protocols/repositories'
import { LoadPerformance } from '@/domain/usecases'

export class DbLoadPerformance implements LoadPerformance {
  constructor(
    private readonly loadPerformanceRepository: LoadPerformanceRepository
  ) {}

  async loadByUserId(userId: string): Promise<LoadPerformance.Result> {
    const performance = await this.loadPerformanceRepository.load(userId)
    return performance
  }
}
