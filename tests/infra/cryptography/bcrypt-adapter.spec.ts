import { Hasher } from '@/data/protocols/cryptography'
import { throwError } from '@/tests/domain/mocks'

import bcrypt from 'bcrypt'

class BcryptAdapter implements Hasher {
  constructor(
    private readonly salt: number
  ) {}

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, salt)
  }
}

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash'
  }
}))

const salt = 12
const makeSut = () => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    it('should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
    })

    it('should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    it('should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
})
