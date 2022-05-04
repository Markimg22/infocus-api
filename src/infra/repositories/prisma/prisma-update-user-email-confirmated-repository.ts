import { UpdateUserEmailConfirmatedRepository } from '@/data/protocols/repositories';

import { PrismaClient } from '@prisma/client';

export class PrismaUpdateUserEmailConfirmatedRepository
  implements UpdateUserEmailConfirmatedRepository
{
  constructor(private readonly client: PrismaClient) {}

  async update(
    data: UpdateUserEmailConfirmatedRepository.Params
  ): Promise<UpdateUserEmailConfirmatedRepository.Result> {
    const result = await this.client.users.updateMany({
      where: { id: data.id },
      data: { emailConfirmated: data.emailConfirmated },
    });
    return result.count !== 0;
  }
}
