import { CreateTaskRespository } from '@/data/protocols/repositories'

import { PrismaClient } from '@prisma/client'

export class PrismaCreateTaskRepository implements CreateTaskRespository {
  constructor (
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateTaskRespository.Params): Promise<CreateTaskRespository.Result> {
    await this.client.tasks.create({ data })
  }
}
