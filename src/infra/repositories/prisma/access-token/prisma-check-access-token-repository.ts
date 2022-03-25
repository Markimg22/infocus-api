import { CheckAccessTokenRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCheckAccessTokenRepository implements CheckAccessTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async check(userId: string): Promise<boolean> {
    const accessTokenAlreadyExists = await this.client.accessToken.findFirst({
      where: { userId }
    })
    return accessTokenAlreadyExists !== null
  }
}
