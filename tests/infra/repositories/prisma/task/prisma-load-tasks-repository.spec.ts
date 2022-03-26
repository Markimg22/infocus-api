import { LoadTasksRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams } from '@/tests/domain/mocks'

import { PrismaClient, Users } from '@prisma/client'

class PrismaLoadTasksRepository implements LoadTasksRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async load(userId: string): Promise<LoadTasksRepository.Result> {
    const tasks = await this.client.tasks.findMany({
      where: { userId }
    })
    return tasks
  }
}

const makeSut = (): PrismaLoadTasksRepository => {
  const sut = new PrismaLoadTasksRepository(client)
  return sut
}

describe('PrismaLoadTasks Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
    await client.tasks.createMany({
      data: [
        mockCreateTaskParams(user.id),
        mockCreateTaskParams(user.id),
        mockCreateTaskParams(user.id),
        mockCreateTaskParams(user.id)
      ]
    })
  })

  afterAll(async () => {
    await client.tasks.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should returns taks with correct userId', async () => {
    const sut = makeSut()
    const tasks = await client.tasks.findMany({ where: { userId: user.id } })
    const loadTasksResult = await sut.load(user.id)
    expect(loadTasksResult).toEqual(tasks)
  })

  it('should return empty array if not exists tasks', async () => {
    const sut = makeSut()
    const loadTasksResult = await sut.load('any_id')
    expect(loadTasksResult).toEqual([])
  })
})
