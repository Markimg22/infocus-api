import { LoadUserByToken } from '@/domain/usecases'

import faker from '@faker-js/faker'

class DbLoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter
  ) {}

  async load(params: LoadUserByToken.Params): Promise<void> {
    const { accessToken } = params
    await this.decrypter.decrypt(accessToken)
  }
}

interface Decrypter {
  decrypt: (cipherText: string) => Promise<void>
}

class DecrypterSpy implements Decrypter {
  cipherText = ''

  async decrypt(cipherText: string): Promise<void> {
    this.cipherText = cipherText
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
})
