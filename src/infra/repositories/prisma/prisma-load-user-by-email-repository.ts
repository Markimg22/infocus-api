import { LoadUserByEmailRepository } from '@/data/protocols/repositories';

import { PrismaClient } from '@prisma/client';

export class PrismaLoadUserByEmailRepository
  implements LoadUserByEmailRepository
{
  constructor(private readonly client: PrismaClient) {}

  async load(email: string): Promise<LoadUserByEmailRepository.Result | null> {
    const user = await this.client.users.findUnique({ where: { email } });
    return user;
  }
}
