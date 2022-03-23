import { JwtAdapter } from '@/infra/cryptography'
import { throwError } from '@/tests/domain/mocks'

import jwt from 'jsonwebtoken'

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
