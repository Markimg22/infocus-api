import { PrismaCreateUserRepository } from '@/infra/repositories/prisma'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'
import { client } from '@/infra/helpers'

const makeSut = (): PrismaCreateUserRepository => {
  const sut = new PrismaCreateUserRepository(client)
  return sut
}

describe('PrismaCreateUser Repository', () => {
  beforeAll(async () => {
    await client.$connect()
  })

  afterAll(async () => {
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should return true if user created on success', async () => {
    const sut = makeSut()
    const result = await sut.create(mockCreateUserParams())
    expect(result).toBe(true)
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.users, 'create').mockImplementationOnce(throwError)
    const result = sut.create(mockCreateUserParams())
    await expect(result).rejects.toThrow()
  })
})
