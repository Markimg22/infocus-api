import { DeleteTaskRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaDeleteTaskRepository implements DeleteTaskRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async delete(data: DeleteTaskRepository.Params): Promise<DeleteTaskRepository.Result> {
    const { id, userId } = data
    await this.client.tasks.deleteMany({
      where: { id, userId }
    })
  }
}
