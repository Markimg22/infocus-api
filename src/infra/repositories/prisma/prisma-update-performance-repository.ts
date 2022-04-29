import { UpdatePerformanceRepository } from '@/data/protocols/repositories';

import { PrismaClient } from '@prisma/client';

export class PrismaUpdatePerformanceRepository
  implements UpdatePerformanceRepository
{
  constructor(private readonly client: PrismaClient) {}

  async update(
    data: UpdatePerformanceRepository.Params
  ): Promise<UpdatePerformanceRepository.Result> {
    const { userId, field, value } = data;
    await this.client.performance.update({
      where: { userId },
      data: {
        [field]: {
          increment: value,
        },
      },
    });
  }
}
