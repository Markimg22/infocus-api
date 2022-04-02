import { PrismaLoadTasksRepository } from '@/infra/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { Users } from '@prisma/client'

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
    const tasks = await client.tasks.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        description: true,
        finished: true,
        createdAt: true
      }
    })
    const loadTasksResult = await sut.load(user.id)
    expect(loadTasksResult).toEqual(tasks)
  })

  it('should return empty array if not exists tasks', async () => {
    const sut = makeSut()
    const loadTasksResult = await sut.load('any_id')
    expect(loadTasksResult).toEqual([])
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.tasks, 'findMany').mockImplementationOnce(throwError)
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
