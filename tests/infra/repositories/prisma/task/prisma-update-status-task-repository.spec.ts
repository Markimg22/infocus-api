import { UpdateStatusTaskRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { PrismaClient, Tasks, Users } from '@prisma/client'

class PrismaUpdateStatusTaskRepository implements UpdateStatusTaskRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async update(data: UpdateStatusTaskRepository.Params): Promise<UpdateStatusTaskRepository.Result> {
    const { id, userId, finished } = data
    await this.client.tasks.updateMany({
      where: { id, userId },
      data: { finished }
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
      finished: true
    })
    const newTask = await client.tasks.findFirst({ where: { userId: user.id } })
    expect(newTask?.finished).toBe(true)
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.tasks, 'updateMany').mockImplementationOnce(throwError)
    const promise = sut.update({
      id: task.id,
      userId: user.id,
      finished: true
    })
    await expect(promise).rejects.toThrow()
  })
})
