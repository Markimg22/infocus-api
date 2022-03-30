import { CreateUserRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCreateUserRepository implements CreateUserRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    const user = await this.client.users.create({ data })
    return user.id
  }
}
