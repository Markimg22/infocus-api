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
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository
  ) {}

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    const exists = await this.checkUserByEmailRepository.check(params.email)
    if (exists) {
      return false
    }
    return true
  }
}

const mockCreateUser = (): CreateUser.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: DbCreateUser,
  checkUserByEmailRepositorySpy: CheckUserByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkUserByEmailRepositorySpy = new CheckUserByEmailRepositorySpy()
  const sut = new DbCreateUser(checkUserByEmailRepositorySpy)
  return {
    sut,
    checkUserByEmailRepositorySpy
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
    const fakeUser = mockCreateUser()
    await sut.create(fakeUser)
    expect(checkUserByEmailRepositorySpy.email).toBe(fakeUser.email)
  })

  it('should throws if CheckUserByEmailRepository throws', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkUserByEmailRepositorySpy, 'check').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateUser())
    await expect(promise).rejects.toThrow()
  })
})
