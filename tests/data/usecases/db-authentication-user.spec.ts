import { AuthenticationUser } from '@/domain/usecases'
import faker from '@faker-js/faker'

class DbAuthenticationUser {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository
  ) {}

  async auth(params: AuthenticationUser.Params): Promise<void> {
    await this.loadUserByEmailRepository.loadByEmail(params.email)
  }
}

interface LoadUserByEmailRepository {
  loadByEmail: (email: string) => Promise<void>
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

  async loadByEmail(email: string): Promise<void> {
    this.email = email
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
})
