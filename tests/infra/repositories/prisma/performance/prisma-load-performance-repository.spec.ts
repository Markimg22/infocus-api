import { LoadPerformanceRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'

import { PrismaClient, Users } from '@prisma/client'

const mockCreatePerformanceParams = (userId: string): CreatePerformanceRepository.Params => ({
  userId,
  totalTasksFinished: faker.datatype.number(),
  totalRestTime: faker.datatype.number(),
  totalWorkTime: faker.datatype.number()
})

interface CreatePerformanceRepository {
  create: () => Promise<void>
}

namespace CreatePerformanceRepository {
  export type Params = {
    userId: string,
    totalTasksFinished: number,
    totalRestTime: number,
    totalWorkTime: number
  }
}

class PrismaLoadPerformanceRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async load(userId: string): Promise<LoadPerformanceRepository.Result> {
    const performance = await this.client.performance.findFirst({
      where: { userId }
    })
    if (performance) {
      return {
        totalRestTime: performance.totalRestTime,
        totalTasksFinished: performance.totalTasksFinished,
        totalWorkTime: performance.totalWorkTime
      }
    }
    return {} as LoadPerformanceRepository.Result
  }
}

const makeSut = (): PrismaLoadPerformanceRepository => {
  const sut = new PrismaLoadPerformanceRepository(client)
  return sut
}

describe('PrismaLoadPerformance Repository', () => {
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

  it('should return user performance on success', async () => {
    const sut = makeSut()
    const createPerformanceParams = mockCreatePerformanceParams(user.id)
    await client.performance.create({
      data: createPerformanceParams
    })
    const performance = await sut.load(user.id)
    expect(performance.totalRestTime).toBe(createPerformanceParams.totalRestTime)
    expect(performance.totalTasksFinished).toBe(createPerformanceParams.totalTasksFinished)
    expect(performance.totalWorkTime).toBe(createPerformanceParams.totalWorkTime)
  })

  it('should retuns {} if not user found', async () => {
    const sut = makeSut()
    const performance = await sut.load('any_id')
    expect(performance).toEqual({})
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.performance, 'findFirst').mockImplementationOnce(throwError)
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
