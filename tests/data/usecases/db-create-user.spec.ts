import { CreateUser } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

interface CheckUserByEmailRepository {
  check: (email: string) => Promise<boolean>
}

class CheckUserByEmailRepositorySpy implements CheckUserByEmailRepository {
  exists = false
  email = ''

  async check(email: string): Promise<boolean> {
    this.email = email
    return this.exists
  }
}

class DbCreateUser {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    const { name, email, password } = params
    const userAlreadyExists = await this.checkUserByEmailRepository.check(email)
    if (!userAlreadyExists) {
      const hashedPassword = await this.hasher.hash(password)
      await this.createUserRepository.create({
        name,
        email,
        password: hashedPassword
      })
      return true
    }
    return false
  }
}

interface Hasher {
  hash: (plainText: string) => Promise<string>
}

class HasherSpy implements Hasher {
  plainText = ''
  hashedText = faker.datatype.uuid()

  async hash(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.hashedText
  }
}

interface CreateUserRepository {
  create: (data: CreateUser.Params) => Promise<void>
}

class CreateUserRepositorySpy implements CreateUserRepository {
  params = {}

  async create(data: CreateUser.Params): Promise<void> {
    this.params = data
  }
}

const mockCreateUser = (): CreateUser.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: DbCreateUser,
  checkUserByEmailRepositorySpy: CheckUserByEmailRepositorySpy,
  hasherSpy: HasherSpy,
  createUserRepositorySpy: CreateUserRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositorySpy = new CheckUserByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const createUserRepositorySpy = new CreateUserRepositorySpy()
  const sut = new DbCreateUser(checkUserByEmailRepositorySpy, hasherSpy, createUserRepositorySpy)
  return {
    sut,
    checkUserByEmailRepositorySpy,
    hasherSpy,
    createUserRepositorySpy
  }
}

describe('DbCreateUser UseCase', () => {
  it('should return false if CheckUserByEmailRepository returns true', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    checkUserByEmailRepositorySpy.exists = true
    const result = await sut.create(mockCreateUser())
    expect(result).toBe(false)
  })

  it('should return true if CheckUserByEmailRepository returns false', async () => {
    const { sut } = makeSut()
    const result = await sut.create(mockCreateUser())
    expect(result).toBe(true)
  })

  it('should call CheckUserByEmailRepository with correct email', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    const createUserParams = mockCreateUser()
    await sut.create(createUserParams)
    expect(checkUserByEmailRepositorySpy.email).toBe(createUserParams.email)
  })

  it('should throws if CheckUserByEmailRepository throws', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkUserByEmailRepositorySpy, 'check').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateUser())
    await expect(promise).rejects.toThrow()
  })

  it('should call Hasher with correct plainText', async () => {
    const { sut, hasherSpy } = makeSut()
    const createUserParams = mockCreateUser()
    await sut.create(createUserParams)
    expect(hasherSpy.plainText).toBe(createUserParams.password)
  })

  it('should throws if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateUser())
    await expect(promise).rejects.toThrow()
  })

  it('should call CreateUserRepository with correct values', async () => {
    const { sut, hasherSpy, createUserRepositorySpy } = makeSut()
    const createUserParams = mockCreateUser()
    await sut.create(createUserParams)
    expect(createUserRepositorySpy.params).toEqual({
      name: createUserParams.name,
      email: createUserParams.email,
      password: hasherSpy.hashedText
    })
  })
})
