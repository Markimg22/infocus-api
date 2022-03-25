import { CheckAccessTokenRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateAccessTokenParams, mockCreateUserParams } from '@/tests/domain/mocks'

import { PrismaClient, Users } from '@prisma/client'

class PrismaCheckAccessTokenRepository implements CheckAccessTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async check(userId: string): Promise<boolean> {
    const accessTokenAlreadyExists = await this.client.accessToken.findFirst({
      where: { userId }
    })
    return accessTokenAlreadyExists !== null
  }
}

const makeSut = (): PrismaCheckAccessTokenRepository => {
  const sut = new PrismaCheckAccessTokenRepository(client)
  return sut
}

describe('PrismaCheckAccessToken Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should return true if access token already exists', async () => {
    const sut = makeSut()
    await client.accessToken.create({
      data: mockCreateAccessTokenParams(user.id)
    })
    const accessTokenAlreadyExists = await sut.check(user.id)
    expect(accessTokenAlreadyExists).toBe(true)
  })
})
