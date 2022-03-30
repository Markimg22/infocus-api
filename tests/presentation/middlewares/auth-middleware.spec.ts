import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadUserByTokenSpy } from '@/tests/presentation/mocks'

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware,
  loadUserByTokenSpy: LoadUserByTokenSpy
}

const makeSut = (): SutTypes => {
  const loadUserByTokenSpy = new LoadUserByTokenSpy()
  const sut = new AuthMiddleware(loadUserByTokenSpy)
  return {
    sut,
    loadUserByTokenSpy
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadUserByToken with correct accessToken', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadUserByTokenSpy.params).toEqual({
      accessToken: httpRequest.accessToken
    })
  })

  it('should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadUserByToken returns an user', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      userId: loadUserByTokenSpy.result?.id
    }))
  })

  it('should return 500 if LoadUserByToken throws', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    jest.spyOn(loadUserByTokenSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
