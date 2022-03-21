import { AuthenticationUser } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class DbAuthenticationUser implements AuthenticationUser {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth(params: AuthenticationUser.Params): Promise<AuthenticationUser.Result | null> {
    const user = await this.loadUserByEmailRepository.loadByEmail(params.email)
    if (!user) return null
    const { password } = params
    await this.hashComparer.compare(password, user.password)
    return {
      accessToken: 'any accessToken',
      name: 'any name'
    }
  }
}

interface LoadUserByEmailRepository {
  loadByEmail: (email: string) => Promise<LoadUserByEmailRepository.Result | null>
}

namespace LoadUserByEmailRepository {
  export type Result = {
    id: string,
    name: string,
    password: string
  }
}

class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
  email = ''
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  } as LoadUserByEmailRepository.Result | null

  async loadByEmail(email: string): Promise<LoadUserByEmailRepository.Result | null> {
    this.email = email
    return this.result
  }
}

interface HashComparer {
  compare: (plainText: string, hashedText: string) => Promise<void>
}

class HashComparerSpy implements HashComparer {
  plainText = ''
  hashedText = ''

  async compare(plainText: string, hashedText: string): Promise<void> {
    this.plainText = plainText
    this.hashedText = hashedText
  }
}

const mockAuthenticationUserParams = (): AuthenticationUser.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: DbAuthenticationUser,
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy,
  hashComparerSpy: HashComparerSpy
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const sut = new DbAuthenticationUser(loadUserByEmailRepositorySpy, hashComparerSpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
    hashComparerSpy
  }
}

describe('DbAuthenticationUser UseCase', () => {
  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationUserParams = mockAuthenticationUserParams()
    await sut.auth(authenticationUserParams)
    expect(loadUserByEmailRepositorySpy.email).toBe(authenticationUserParams.email)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = null
    const result = await sut.auth(mockAuthenticationUserParams())
    expect(result).toBeNull()
  })

  it('should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call HashComparer to correct values', async () => {
    const { sut, hashComparerSpy, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationUserParams = mockAuthenticationUserParams()
    await sut.auth(authenticationUserParams)
    expect(hashComparerSpy.plainText).toBe(authenticationUserParams.password)
    expect(hashComparerSpy.hashedText).toBe(loadUserByEmailRepositorySpy.result?.password)
  })
})
