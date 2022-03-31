import { LoadUserByTokenRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateAccessTokenParams, mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import { AccessToken, PrismaClient, Users } from '@prisma/client'

class PrismaLoadUserByTokenRepository implements LoadUserByTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async load(data: LoadUserByTokenRepository.Params): Promise<LoadUserByTokenRepository.Result | null> {
    const accessToken = await this.client.accessToken.findUnique({
      where: {
        token: data.accessToken
      }
    })
    if (accessToken) {
      return {
        id: accessToken.userId
      }
    }
    return null
  }
}

const makeSut = (): PrismaLoadUserByTokenRepository => {
  const sut = new PrismaLoadUserByTokenRepository(client)
  return sut
}

describe('PrismaLoadUserByToken Repository', () => {
  let user: Users
  let accessToken: AccessToken

  beforeAll(async () => {
    await client.$connect()
    user = await client.users.create({
      data: mockCreateUserParams()
    })
    accessToken = await client.accessToken.create({
      data: mockCreateAccessTokenParams(user.id)
    })
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should return an user by token', async () => {
    const sut = makeSut()
    const result = await sut.load({
      accessToken: accessToken.token
    })
    expect(result).toEqual({
      id: user.id
    })
  })

  it('should return null if user not found', async () => {
    const sut = makeSut()
    const result = await sut.load({
      accessToken: 'any_token'
    })
    expect(result).toBeNull()
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.accessToken, 'findUnique').mockImplementationOnce(throwError)
    const promise = sut.load({ accessToken: 'any_token' })
    await expect(promise).rejects.toThrow()
  })
})
