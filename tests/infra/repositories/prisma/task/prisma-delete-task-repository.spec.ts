import { DeleteTaskRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { PrismaClient, Tasks, Users } from '@prisma/client'

class PrismaDeleteTaskRepository implements DeleteTaskRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async delete(data: DeleteTaskRepository.Params): Promise<DeleteTaskRepository.Result> {
    const { id, userId } = data
    await this.client.tasks.deleteMany({
      where: { id, userId }
    })
  }
}

const makeSut = (): PrismaDeleteTaskRepository => {
  const sut = new PrismaDeleteTaskRepository(client)
  return sut
}

describe('PrismaDeleteTask Repository', () => {
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

  it('should delete task on success', async () => {
    const sut = makeSut()
    await sut.delete({
      id: task.id,
      userId: user.id
    })
    const tasks = await client.tasks.findFirst({ where: { userId: user.id } })
    expect(tasks).toBeNull()
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.tasks, 'deleteMany').mockImplementationOnce(throwError)
    const promise = sut.delete({ id: 'any_id', userId: 'any_id' })
    await expect(promise).rejects.toThrow()
  })
})
