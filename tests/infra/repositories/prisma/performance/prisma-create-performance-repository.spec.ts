import { CreatePerformanceRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreatePerformanceParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { PrismaClient, Users } from '@prisma/client'

class PrismaCreatePerformanceRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async create(data: CreatePerformanceRepository.Params): Promise<CreatePerformanceRepository.Result> {
    await this.client.performance.create({
      data
    })
  }
}

const makeSut = (): PrismaCreatePerformanceRepository => {
  const sut = new PrismaCreatePerformanceRepository(client)
  return sut
}

describe('PrismaCreatePerformance Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
  })

  afterAll(async () => {
    await client.performance.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should create user performance on success', async () => {
    const sut = makeSut()
    const createPerformanceParams = mockCreatePerformanceParams(user.id)
    await sut.create(createPerformanceParams)
    const performance = await client.performance.findFirst({
      where: { userId: user.id }
    })
    expect(createPerformanceParams).toEqual({
      totalRestTime: performance?.totalRestTime,
      totalTasksFinished: performance?.totalTasksFinished,
      totalWorkTime: performance?.totalWorkTime,
      userId: performance?.userId
    })
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.performance, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreatePerformanceParams(user.id))
    await expect(promise).rejects.toThrow()
  })
})
