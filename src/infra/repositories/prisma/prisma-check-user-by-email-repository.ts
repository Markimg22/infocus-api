import { CheckUserByEmailRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCheckUserByEmailRepository implements CheckUserByEmailRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async check(email: string): Promise<boolean> {
    const user = await this.client.users.findFirst({ where: { email } })
    return !!user
  }
}
