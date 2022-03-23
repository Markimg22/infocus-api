import { UpdateAccessTokenRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateUserParams } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'
import { PrismaClient, Users } from '@prisma/client'

class PrismaUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async update(id: string, token: string): Promise<void> {
    await this.client.accessToken.update({
      where: { userId: id },
      data: { token }
    })
  }
}

const makeSut = (): PrismaUpdateAccessTokenRepository => {
  const sut = new PrismaUpdateAccessTokenRepository(client)
  return sut
}

describe('PrismaUpdateAccessToken Repository', () => {
  let user: Users

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
    await client.accessToken.create({
      data: {
        token: faker.datatype.uuid(),
        userId: user.id
      }
    })
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should updated the user access token on success', async () => {
    const sut = makeSut()
    const token = faker.datatype.uuid()
    await sut.update(user.id, token)
    const newAccessToken = await client.accessToken.findFirst({
      where: { userId: user.id }
    })
    expect(newAccessToken?.token).toBe(token)
  })
})
