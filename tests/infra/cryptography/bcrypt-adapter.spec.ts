import bcrypt from 'bcrypt'

class BcryptAdapter {
  constructor(
    private readonly salt: number
  ) {}

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, salt)
  }
}

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
  })
})
