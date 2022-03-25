import { DbAuthenticationUser } from '@/data/usecases'
import { mockAuthenticationUserParams, throwError } from '@/tests/domain/mocks'
import {
  LoadUserByEmailRepositorySpy,
  HashComparerSpy,
  EncrypterSpy,
  UpdateAccessTokenRepositorySpy
} from '@/tests/data/mocks'
import { CheckAccessTokenRepository } from '@/data/protocols/repositories'

class CheckAccessTokenRepositorySpy implements CheckAccessTokenRepository {
  userId = ''
  result = true

  async check(userId: string): Promise<boolean> {
    this.userId = userId
    return this.result
  }
}

type SutTypes = {
  sut: DbAuthenticationUser,
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy,
  hashComparerSpy: HashComparerSpy,
  encrypterSpy: EncrypterSpy,
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy,
  checkAccessTokenRepositorySpy: CheckAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const checkAccessTokenRepositorySpy = new CheckAccessTokenRepositorySpy()
  const sut = new DbAuthenticationUser(loadUserByEmailRepositorySpy, hashComparerSpy, encrypterSpy, updateAccessTokenRepositorySpy, checkAccessTokenRepositorySpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
    checkAccessTokenRepositorySpy
  }
}

describe('DbAuthenticationUser UseCase', () => {
  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationUserParams = mockAuthenticationUserParams()
    await sut.auth(authenticationUserParams)
    expect(loadUserByEmailRepositorySpy.email).toBe(authenticationUserParams.email)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.result = null
    const result = await sut.auth(mockAuthenticationUserParams())
    expect(result).toBeNull()
  })

  it('should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call HashComparer to correct values', async () => {
    const { sut, hashComparerSpy, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationUserParams = mockAuthenticationUserParams()
    await sut.auth(authenticationUserParams)
    expect(hashComparerSpy.plainText).toBe(authenticationUserParams.password)
    expect(hashComparerSpy.hashedText).toBe(loadUserByEmailRepositorySpy.result?.password)
  })

  it('should throws if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.result = false
    const result = await sut.auth(mockAuthenticationUserParams())
    expect(result).toBeNull()
  })

  it('should call Encrypter with correct plainText', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    const authenticationUserParams = mockAuthenticationUserParams()
    await sut.auth(authenticationUserParams)
    expect(encrypterSpy.plainText).toBe(loadUserByEmailRepositorySpy.result?.id)
  })

  it('should throws if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should retun an data on success', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    const result = await sut.auth(mockAuthenticationUserParams())
    expect(result?.accessToken).toBe(encrypterSpy.result)
    expect(result?.name).toBe(loadUserByEmailRepositorySpy.result?.name)
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationUserParams())
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.result)
    expect(updateAccessTokenRepositorySpy.id).toBe(loadUserByEmailRepositorySpy.result?.id)
  })

  it('should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationUserParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call CheckAccessTokenRepository with correct userId', async () => {
    const { sut, checkAccessTokenRepositorySpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationUserParams())
    expect(checkAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.result?.id)
  })

  it('should call UpdateAccessTokenRepository if CheckAccessTokenRepository returns true', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationUserParams())
    expect(updateAccessTokenRepositorySpy.callsCount).toBe(1)
  })

  it('should not call UpdateAccessTokenRepository if CheckAccessTokenRepository returns false', async () => {
    const { sut, updateAccessTokenRepositorySpy, checkAccessTokenRepositorySpy } = makeSut()
    checkAccessTokenRepositorySpy.result = false
    await sut.auth(mockAuthenticationUserParams())
    expect(updateAccessTokenRepositorySpy.callsCount).toBe(0)
  })
})
