import { LoadUserByEmailRepository } from '@/data/protocols/repositories'
import { client } from '@/infra/helpers'
import { mockCreateUserParams } from '@/tests/domain/mocks'

import { PrismaClient } from '@prisma/client'

class PrismaLoadUserByEmailRepository implements LoadUserByEmailRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async loadByEmail(email: string): Promise<LoadUserByEmailRepository.Result | null> {
    const user = await this.client.users.findFirst({ where: { email } })
    return user
  }
}

const makeSut = (): PrismaLoadUserByEmailRepository => {
  const sut = new PrismaLoadUserByEmailRepository(client)
  return sut
}

describe('PrismaLoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await client.$connect()
  })

  afterAll(async () => {
    await client.users.deleteMany()
    await client.$disconnect()
  })

  it('should return an user on success', async () => {
    const sut = makeSut()
    const createUserParams = mockCreateUserParams()
    await client.users.create({ data: createUserParams })
    const user = await sut.loadByEmail(createUserParams.email)
    expect(user).toBeTruthy()
    expect(user?.id).toBeTruthy()
    expect(user?.name).toBe(createUserParams.name)
    expect(user?.password).toBe(createUserParams.password)
  })
})
