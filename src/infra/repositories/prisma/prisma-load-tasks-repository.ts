import { LoadTasksRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaLoadTasksRepository implements LoadTasksRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async load(userId: string): Promise<LoadTasksRepository.Result> {
    const tasks = await this.client.tasks.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    })
    return tasks
  }
}
