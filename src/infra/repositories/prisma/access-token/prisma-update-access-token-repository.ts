import { UpdateAccessTokenRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async update(id: string, token: string): Promise<void> {
    await this.client.accessToken.update({
      where: { userId: id },
      data: { token }
    })
  }
}
