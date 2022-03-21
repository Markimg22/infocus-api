import { PrismaCreateUserRepository } from '@/infra/repositories/prisma'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'
import { MockContext, Context, createMockContext, mockCreateUserDatabaseParams } from '@/tests/infra/mocks'

let mockCtx: MockContext
let ctx: Context

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
