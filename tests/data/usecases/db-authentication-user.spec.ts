import { AuthenticationUser } from '@/domain/usecases'
import faker from '@faker-js/faker'

class DbAuthenticationUser implements AuthenticationUser {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository
  ) {}

  async auth(params: AuthenticationUser.Params): Promise<AuthenticationUser.Result | null> {
    const user = await this.loadUserByEmailRepository.loadByEmail(params.email)
    if (!user) return null
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

const mockAuthenticationUserParams = (): AuthenticationUser.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: DbAuthenticationUser,
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new DbAuthenticationUser(loadUserByEmailRepositorySpy)
  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('DbAuthenticationUser UseCase', () => {
  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const fakeUser = mockAuthenticationUserParams()
    await sut.auth(fakeUser)
    expect(loadUserByEmailRepositorySpy.email).toBe(fakeUser.email)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = null
    const result = await sut.auth(mockAuthenticationUserParams())
    expect(result).toBeNull()
  })
})
