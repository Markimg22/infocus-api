import { CheckUserByIdRepository } from '@/data/protocols/repositories';

import { PrismaClient } from '@prisma/client';

export class PrismaCheckUserByIdRepository implements CheckUserByIdRepository {
  constructor(private readonly client: PrismaClient) {}

  async check(id: string): Promise<CheckUserByIdRepository.Result> {
    const user = await this.client.users.findUnique({
      where: { id },
    });
    return user !== null;
  }
}
