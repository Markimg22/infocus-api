import { CreateAccessTokenRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'
import { PrismaClient, Users } from '@prisma/client'

class PrismaCreateAccessTokenRepository implements CreateAccessTokenRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateAccessTokenRepository.Params): Promise<CreateAccessTokenRepository.Result> {
    await this.client.accessToken.create({ data })
  }
}

const mockCreateAccessTokenParams = (userId: string): CreateAccessTokenRepository.Params => ({
  token: faker.datatype.uuid(),
  userId
})

const makeSut = (): PrismaCreateAccessTokenRepository => {
  const sut = new PrismaCreateAccessTokenRepository(client)
  return sut
}

describe('PrismaCreateAccessToken Repository', () => {
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

  it('should create access token with correct values', async () => {
    const sut = makeSut()
    const createAccessTokenarams = mockCreateAccessTokenParams(user.id)
    await sut.create(createAccessTokenarams)
    const accessToken = await client.accessToken.findFirst({ where: { userId: user.id } })
    expect(accessToken?.token).toBe(createAccessTokenarams.token)
    expect(accessToken?.userId).toBe(createAccessTokenarams.userId)
  })

  it('should throw if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(client.accessToken, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateAccessTokenParams(user.id))
    await expect(promise).rejects.toThrow()
  })
})
