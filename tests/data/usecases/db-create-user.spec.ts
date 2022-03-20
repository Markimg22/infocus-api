interface CheckUserByEmailRepository {
  check: () => Promise<boolean>
}

class CheckUserByEmailRepositorySpy implements CheckUserByEmailRepository {
  exists = false

  async check(): Promise<boolean> {
    return this.exists
  }
}

class DbCreateUser {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository
  ) {}

  async create(): Promise<boolean> {
    const exists = await this.checkUserByEmailRepository.check()
    if (exists) {
      return false
    }
    return true
  }
}

const makeSut = () => {
  const checkUserByEmailRepositorySpy = new CheckUserByEmailRepositorySpy()
  const sut = new DbCreateUser(checkUserByEmailRepositorySpy)
  return {
    sut,
    checkUserByEmailRepositorySpy
  }
}

describe('DbCreateUser UseCase', () => {
  it('should return false if CheckUserByEmailRepository returns true', async () => {
    const { sut, checkUserByEmailRepositorySpy } = makeSut()
    checkUserByEmailRepositorySpy.exists = true
    const result = await sut.create()
    expect(result).toBe(false)
  })
})
