import { CreateUserRepository } from '@/data/protocols/repositories'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'
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
    return !!user
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

  it('should return false if user not created', async () => {
    const sut = makeSut()
    const result = await sut.create(mockCreateUserParams())
    expect(result).toBe(false)
  })

  it('should throws if client database throws', async () => {
    const sut = makeSut()
    jest.spyOn(ctx.prisma.users, 'create').mockImplementationOnce(throwError)
    const result = sut.create(mockCreateUserParams())
    await expect(result).rejects.toThrow()
  })
})
