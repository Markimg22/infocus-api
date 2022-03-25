import { CreateTaskRespository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams } from '@/tests/domain/mocks'

import { PrismaClient, Users } from '@prisma/client'

class PrismaCreateTaskRepository implements CreateTaskRespository {
  constructor (
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateTaskRespository.Params): Promise<CreateTaskRespository.Result> {
    await this.client.tasks.create({ data })
  }
}

const makeSut = (): PrismaCreateTaskRepository => {
  const sut = new PrismaCreateTaskRepository(client)
  return sut
}

describe('PrismaCreateTask Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
  })

  afterAll(async () => {
    await client.tasks.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should create task with correct values', async () => {
    const sut = makeSut()
    const createTaskParams = mockCreateTaskParams(user.id)
    await sut.create(createTaskParams)
    const task = await client.tasks.findFirst({ where: { userId: user.id } })
    expect(task?.title).toBe(createTaskParams.title)
    expect(task?.description).toBe(createTaskParams.description)
    expect(task?.isCompleted).toBe(createTaskParams.isCompleted)
    expect(task?.userId).toBe(createTaskParams.userId)
  })
})
