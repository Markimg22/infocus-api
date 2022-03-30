import { LoadUserByToken } from '@/domain/usecases'

import faker from '@faker-js/faker'

class DbLoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load(params: LoadUserByToken.Params): Promise<LoadUserByToken.Result | null> {
    const { accessToken, role } = params
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      await this.loadUserByTokenRepository.load({ accessToken, role })
    }
    return null
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
  load: (data: LoadUserByTokenRepository.Params) => Promise<void>
}

namespace LoadUserByTokenRepository {
  export type Params = LoadUserByToken.Params
}

class LoadUserByTokenRepositorySpy implements LoadUserByTokenRepository {
  data = {}

  async load(data: LoadUserByTokenRepository.Params): Promise<void> {
    this.data = data
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
})
