import { DbCreateUser } from '@/data/usecases'
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks'
import {
  CheckUserByEmailRepositorySpy,
  HasherSpy,
  CreateUserRepositorySpy
} from '@/tests/data/mocks'
import { CreatePerformanceRepository } from '@/data/protocols/repositories'

class CreatePerformanceRepositorySpy implements CreatePerformanceRepository {
  userId = ''

  async create(data: CreatePerformanceRepository.Params): Promise<void> {
    this.userId = data.userId
  }
}

type SutTypes = {
  sut: DbCreateUser,
  checkUserByEmailRepositorySpy: CheckUserByEmailRepositorySpy,
  hasherSpy: HasherSpy,
  createUserRepositorySpy: CreateUserRepositorySpy,
  createPerformanceRepositorySpy: CreatePerformanceRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositorySpy = new CheckUserByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createUserRepositorySpy = new CreateUserRepositorySpy()
  const createPerformanceRepositorySpy = new CreatePerformanceRepositorySpy()
  const sut = new DbCreateUser(checkUserByEmailRepositorySpy, hasherSpy, createUserRepositorySpy, createPerformanceRepositorySpy)
  return {
    sut,
    checkUserByEmailRepositorySpy,
    hasherSpy,
    createUserRepositorySpy,
    createPerformanceRepositorySpy
  }
}

describe('DbCreateUser UseCase', () => {
  it('should return false if CheckUserByEmailRepository returns true', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    checkUserByEmailRepositorySpy.exists = true
    const result = await sut.create(mockCreateUserParams())
    expect(result).toBe(false)
  })

  it('should return true if CheckUserByEmailRepository returns false', async () => {
    const { sut } = makeSut()
    const result = await sut.create(mockCreateUserParams())
    expect(result).toBe(true)
  })

  it('should call CheckUserByEmailRepository with correct email', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    const createUserParams = mockCreateUserParams()
    await sut.create(createUserParams)
    expect(checkUserByEmailRepositorySpy.email).toBe(createUserParams.email)
  })

  it('should throws if CheckUserByEmailRepository throws', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkUserByEmailRepositorySpy, 'check').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call Hasher with correct plainText', async () => {
    const { sut, hasherSpy } = makeSut()
    const createUserParams = mockCreateUserParams()
    await sut.create(createUserParams)
    expect(hasherSpy.plainText).toBe(createUserParams.password)
  })

  it('should throws if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call CreateUserRepository with correct values', async () => {
    const { sut, hasherSpy, createUserRepositorySpy } = makeSut()
    const createUserParams = mockCreateUserParams()
    await sut.create(createUserParams)
    expect(createUserRepositorySpy.params).toEqual({
      name: createUserParams.name,
      email: createUserParams.email,
      password: hasherSpy.hashedText
    })
  })

  it('should throws if CreateUserRepository throws', async () => {
    const { sut, createUserRepositorySpy } = makeSut()
    jest.spyOn(createUserRepositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return false if CreateUserRepository returns null', async () => {
    const { sut, createUserRepositorySpy } = makeSut()
    createUserRepositorySpy.result = ''
    const userCreated = await sut.create(mockCreateUserParams())
    expect(userCreated).toBe(false)
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()
    const userCreated = await sut.create(mockCreateUserParams())
    expect(userCreated).toBe(true)
  })

  it('should call CreatePerformanceRepository with correct userId', async () => {
    const { sut, createPerformanceRepositorySpy, createUserRepositorySpy } = makeSut()
    await sut.create(mockCreateUserParams())
    expect(createPerformanceRepositorySpy.userId).toBe(createUserRepositorySpy.result)
  })
})
