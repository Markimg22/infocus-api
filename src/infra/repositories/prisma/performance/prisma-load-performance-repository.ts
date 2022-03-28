import { LoadPerformanceRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaLoadPerformanceRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async load(userId: string): Promise<LoadPerformanceRepository.Result> {
    const performance = await this.client.performance.findFirst({
      where: { userId }
    })
    if (performance) {
      return {
        totalRestTime: performance.totalRestTime,
        totalTasksFinished: performance.totalTasksFinished,
        totalWorkTime: performance.totalWorkTime
      }
    }
    return {} as LoadPerformanceRepository.Result
  }
}
