import { Encrypter } from '@/data/protocols/cryptography'
import { throwError } from '@/tests/domain/mocks'

import jwt from 'jsonwebtoken'

class JwtAdapter implements Encrypter {
  constructor(
    private readonly secret: string
  ) {}

  async encrypt(plainText: string): Promise<string> {
    return jwt.sign({ id: plainText }, this.secret)
  }
}

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token'
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('secret')
  return sut
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on sign succeds', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    it('should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
