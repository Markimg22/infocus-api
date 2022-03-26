import { UpdateStatusTaskRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams } from '@/tests/domain/mocks'

import { PrismaClient, Tasks, Users } from '@prisma/client'

class PrismaUpdateStatusTaskRepository implements UpdateStatusTaskRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async update(data: UpdateStatusTaskRepository.Params): Promise<UpdateStatusTaskRepository.Result> {
    const { id, userId, status } = data
    await this.client.tasks.updateMany({
      where: { id, userId },
      data: { isCompleted: status }
    })
  }
}

const makeSut = (): PrismaUpdateStatusTaskRepository => {
  const sut = new PrismaUpdateStatusTaskRepository(client)
  return sut
}

describe('PrismaUpdateStatusTask Repository', () => {
  let user: Users
  let task: Tasks

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
    task = await client.tasks.create({
      data: mockCreateTaskParams(user.id)
    })
  })

  afterAll(async () => {
    await client.tasks.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should update status task with correct values', async () => {
    const sut = makeSut()
    await sut.update({
      id: task.id,
      userId: user.id,
      status: true
    })
    const newTask = await client.tasks.findFirst({ where: { userId: user.id } })
    expect(newTask?.isCompleted).toBe(true)
  })
})
