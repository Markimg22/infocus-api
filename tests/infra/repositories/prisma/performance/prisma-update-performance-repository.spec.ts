import { UpdatePerformanceRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

import { PrismaClient, Users } from '@prisma/client'

class PrismaUpdatePerformanceRepository implements UpdatePerformanceRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async update(data: UpdatePerformanceRepository.Params): Promise<UpdatePerformanceRepository.Result> {
    const { userId, field, value } = data
    await this.client.performance.update({
      where: { userId },
      data: { [field]: value }
    })
  }
}

const makeSut = (): PrismaUpdatePerformanceRepository => {
  const sut = new PrismaUpdatePerformanceRepository(client)
  return sut
}

describe('PrismaUpdatePerformance Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
    await client.performance.create({
      data: { userId: user.id }
    })
  })

  afterAll(async () => {
    await client.performance.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should update totalTasksFinished in performance successfully', async () => {
    const sut = makeSut()
    const value = faker.datatype.number()
    await sut.update({
      userId: user.id,
      field: 'totalTasksFinished',
      value
    })
    const performance = await client.performance.findUnique({
      where: { userId: user.id }
    })
    expect(performance?.totalTasksFinished).toBe(value)
  })

  it('should update totalRestTime in performance successfully', async () => {
    const sut = makeSut()
    const value = faker.datatype.number()
    await sut.update({
      userId: user.id,
      field: 'totalRestTime',
      value
    })
    const performance = await client.performance.findUnique({
      where: { userId: user.id }
    })
    expect(performance?.totalRestTime).toBe(value)
  })

  it('should update totalWorkTime in performance successfully', async () => {
    const sut = makeSut()
    const value = faker.datatype.number()
    await sut.update({
      userId: user.id,
      field: 'totalWorkTime',
      value
    })
    const performance = await client.performance.findUnique({
      where: { userId: user.id }
    })
    expect(performance?.totalWorkTime).toBe(value)
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.performance, 'update').mockImplementationOnce(throwError)
    const promise = sut.update({} as UpdatePerformanceRepository.Params)
    await expect(promise).rejects.toThrow()
  })
})
