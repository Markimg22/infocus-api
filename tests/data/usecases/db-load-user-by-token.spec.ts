import { DbLoadUserByToken } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { DecrypterSpy, LoadUserByTokenRepositorySpy } from '@/tests/data/mocks'

import faker from '@faker-js/faker'

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

  beforeEach(() => {
    token = faker.datatype.uuid()
  })

  it('should call Decrypter with correct cipherText', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load({ accessToken: token })
    expect(decrypterSpy.cipherText).toBe(token)
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plainText = null
    const user = await sut.load({ accessToken: token })
    expect(user).toBeNull()
  })

  it('should call LoadUserByTokenRepository with correct values', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    await sut.load({ accessToken: token })
    expect(loadUserByTokenRepositorySpy.data).toEqual({ accessToken: token })
  })

  it('should return an user on success', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    const user = await sut.load({ accessToken: token })
    expect(user).toEqual(loadUserByTokenRepositorySpy.result)
  })

  it('should return null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const user = await sut.load({ accessToken: token })
    expect(user).toBeNull()
  })

  it('should throws if LoadUserByTokenRepository throws', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserByTokenRepositorySpy, 'load').mockImplementationOnce(throwError)
    const promise = sut.load({ accessToken: token })
    await expect(promise).rejects.toThrow()
  })
})
