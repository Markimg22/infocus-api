import { PrismaCheckAccessTokenRepository } from '@/infra/repositories'
import { client } from '@/infra/helpers'
import { mockCreateAccessTokenParams, mockCreateUserParams } from '@/tests/domain/mocks'

import { Users } from '@prisma/client'

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

  beforeEach(async () => {
    await client.accessToken.deleteMany()
  })

  afterAll(async () => {
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

  it('should return false if access token not exists', async () => {
    const sut = makeSut()
    const accessTokenAlreadyExists = await sut.check(user.id)
    expect(accessTokenAlreadyExists).toBe(false)
  })
})
