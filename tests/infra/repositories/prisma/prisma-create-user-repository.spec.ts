import { CreateUserRepository } from '@/data/protocols/repositories'
import { mockCreateUserParams } from '@/tests/domain/mocks'
import { MockContext, Context, createMockContext } from '@/tests/infra/mocks'

import faker from '@faker-js/faker'
import { PrismaClient, Users } from '@prisma/client'

let mockCtx: MockContext
let ctx: Context

class PrismaCreateUserRepository implements CreateUserRepository {
  constructor(
    private readonly client: PrismaClient
  ) {}

  async create(data: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    const user = await this.client.users.create({ data })
    return user !== null
  }
}

const mockCreateUserDatabaseParams = (): Users => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent()
})

const makeSut = (): PrismaCreateUserRepository => {
  const sut = new PrismaCreateUserRepository(ctx.prisma)
  return sut
}

describe('PrismaCreateUser Repository', () => {
  beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
  })

  it('should return true if user created on success', async () => {
    const sut = makeSut()
    mockCtx.prisma.users.create.mockResolvedValue(mockCreateUserDatabaseParams())
    const result = await sut.create(mockCreateUserParams())
    expect(result).toBe(true)
  })
})
