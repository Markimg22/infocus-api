import { UpdateStatusTaskRepository } from '@/data/protocols/repositories';

import { PrismaClient } from '@prisma/client';

export class PrismaUpdateStatusTaskRepository
  implements UpdateStatusTaskRepository
{
  constructor(private readonly client: PrismaClient) {}

  async update(
    data: UpdateStatusTaskRepository.Params
  ): Promise<UpdateStatusTaskRepository.Result> {
    const { id, userId, finished } = data;
    const result = await this.client.tasks.updateMany({
      where: { id, userId },
      data: { finished },
    });
    return result.count !== 0;
  }
}
