import { PrismaCheckUserByEmailRepository } from '@/infra/repositories/prisma'
import { client } from '@/infra/helpers'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { Users } from '@prisma/client'

const makeSut = (): PrismaCheckUserByEmailRepository => {
  const sut = new PrismaCheckUserByEmailRepository(client)
  return sut
}

describe('PrismaCheckUserByEmail Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({ data: mockCreateUserParams() })
  })

  afterAll(async () => {
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should return true if find an user', async () => {
    const sut = makeSut()
    const result = await sut.check(user.email)
    expect(result).toBe(true)
  })

  it('should return false if not find a user', async () => {
    const sut = makeSut()
    const result = await sut.check('')
    expect(result).toBe(false)
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.users, 'findFirst').mockImplementationOnce(throwError)
    const result = sut.check('any_email@mail.com')
    await expect(result).rejects.toThrow()
  })
})
