import { LoadUserByToken } from '@/domain/usecases'

import faker from '@faker-js/faker'

class DbLoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter
  ) {}

  async load(params: LoadUserByToken.Params): Promise<LoadUserByToken.Result | null> {
    const { accessToken } = params
    await this.decrypter.decrypt(accessToken)
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

type SutTypes = {
  sut: DbLoadUserByToken,
  decrypterSpy: DecrypterSpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const sut = new DbLoadUserByToken(decrypterSpy)
  return {
    sut,
    decrypterSpy
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
})
