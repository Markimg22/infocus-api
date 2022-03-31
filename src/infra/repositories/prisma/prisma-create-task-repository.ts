import { CreateTaskRepository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCreateTaskRepository implements CreateTaskRepository {
  constructor (
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateTaskRepository.Params): Promise<CreateTaskRepository.Result> {
    await this.client.tasks.create({ data })
  }
}
