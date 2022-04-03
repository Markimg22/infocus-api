import { DeleteTaskRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaDeleteTaskRepository implements DeleteTaskRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async delete(data: DeleteTaskRepository.Params): Promise<DeleteTaskRepository.Result> {
    const { id, userId } = data
    const result = await this.client.tasks.deleteMany({
      where: { id, userId }
    })

    return result.count !== 0
  }
}
