import { CreatePerformanceRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCreatePerformanceRepository implements CreatePerformanceRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async create(data: CreatePerformanceRepository.Params): Promise<CreatePerformanceRepository.Result> {
    await this.client.performance.create({ data })
  }
}
