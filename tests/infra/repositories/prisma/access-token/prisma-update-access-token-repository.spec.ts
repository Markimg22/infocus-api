import { PrismaUpdateAccessTokenRepository } from '@/infra/repositories'
import { client } from '@/infra/helpers'
import { mockCreateAccessTokenParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'
import { Users } from '@prisma/client'

const token = faker.datatype.uuid()

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
      data: mockCreateAccessTokenParams(user.id)
    })
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should updated the user access token on success', async () => {
    const sut = makeSut()
    await sut.update(user.id, token)
    const newAccessToken = await client.accessToken.findFirst({
      where: { userId: user.id }
    })
    expect(newAccessToken?.token).toBe(token)
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.accessToken, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(user.id, token)
    await expect(promise).rejects.toThrow()
  })
})
