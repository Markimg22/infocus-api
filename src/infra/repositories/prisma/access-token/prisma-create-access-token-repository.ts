import { CreateAccessTokenRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCreateAccessTokenRepository implements CreateAccessTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateAccessTokenRepository.Params): Promise<CreateAccessTokenRepository.Result> {
    await this.client.accessToken.create({ data })
  }
}
