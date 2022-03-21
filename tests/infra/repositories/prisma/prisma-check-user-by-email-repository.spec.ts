import { CheckUserByEmailRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { PrismaClient, Users } from '@prisma/client'

class PrismaCheckUserByEmailRepository implements CheckUserByEmailRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async check(email: string): Promise<boolean> {
    const user = await this.client.users.findFirst({ where: { email } })
    return !!user
  }
}

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
