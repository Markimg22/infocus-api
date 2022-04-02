import { PrismaUpdateStatusTaskRepository } from '@/infra/repositories'
import { client } from '@/infra/helpers'
import { mockCreateTaskParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { Tasks, Users } from '@prisma/client'

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

  it('should return true if updated succeds', async () => {
    const sut = makeSut()
    const updatedTask = await sut.update({
      id: task.id,
      userId: user.id,
      finished: false
    })
    expect(updatedTask).toBe(true)
  })
})
