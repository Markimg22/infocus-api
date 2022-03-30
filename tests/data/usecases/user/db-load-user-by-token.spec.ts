import { LoadUserByToken } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class DbLoadUserByToken implements LoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load(params: LoadUserByToken.Params): Promise<LoadUserByToken.Result | null> {
    try {
      const { accessToken, role } = params
      const token = await this.decrypter.decrypt(accessToken)
      if (token) {
        const user = await this.loadUserByTokenRepository.load({ accessToken, role })
        if (user) return user
      }
      return null
    } catch (error) {
      return null
    }
  }
}

interface Decrypter {
  decrypt: (cipherText: string) => Promise<string | null>
}

class DecrypterSpy implements Decrypter {
  cipherText = ''
  plainText: string | null = faker.internet.password()

  async decrypt(cipherText: string): Promise<string | null> {
    this.cipherText = cipherText
    return this.plainText
  }
}

interface LoadUserByTokenRepository {
  load: (data: LoadUserByTokenRepository.Params) => Promise<LoadUserByTokenRepository.Result>
}

namespace LoadUserByTokenRepository {
  export type Params = LoadUserByToken.Params
  export type Result = LoadUserByToken.Result
}

class LoadUserByTokenRepositorySpy implements LoadUserByTokenRepository {
  data = {}
  result = {
    id: faker.datatype.uuid()
  } as LoadUserByTokenRepository.Result

  async load(data: LoadUserByTokenRepository.Params): Promise<LoadUserByTokenRepository.Result> {
    this.data = data
    return this.result
  }
}

type SutTypes = {
  sut: DbLoadUserByToken,
  decrypterSpy: DecrypterSpy,
  loadUserByTokenRepositorySpy: LoadUserByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadUserByTokenRepositorySpy = new LoadUserByTokenRepositorySpy()
  const sut = new DbLoadUserByToken(decrypterSpy, loadUserByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadUserByTokenRepositorySpy
  }
}

describe('DbLoadUserByToken UseCase', () => {
  let token: string
  let role: string

  beforeEach(() => {
    token = faker.datatype.uuid()
    role = faker.random.word()
  })

  it('should call Decrypter with correct cipherText', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load({ accessToken: token, role })
    expect(decrypterSpy.cipherText).toBe(token)
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plainText = null
    const user = await sut.load({ accessToken: token, role })
    expect(user).toBeNull()
  })

  it('should call LoadUserByTokenRepository with correct values', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    await sut.load({ accessToken: token, role })
    expect(loadUserByTokenRepositorySpy.data).toEqual({
      accessToken: token, role
    })
  })

  it('should return an user on success', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    const user = await sut.load({ accessToken: token, role })
    expect(user).toEqual(loadUserByTokenRepositorySpy.result)
  })

  it('should return null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const user = await sut.load({ accessToken: token, role })
    expect(user).toBeNull()
  })
})
