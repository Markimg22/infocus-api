import { forbidden, ok, serverError } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class AccessDeniedError extends Error {
  constructor() {
    super('Access denied')
    this.name = 'AccessDeniedError'
  }
}

class AuthMiddleware {
  constructor(
    private readonly loadUserByToken: LoadUserByToken,
    private readonly role?: string
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const user = await this.loadUserByToken.load({ accessToken, role: this.role })
        if (user) return ok({ userId: user.id })
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

interface LoadUserByToken {
  load: (params: LoadUserByToken.Params) => Promise<LoadUserByToken.Result | null>
}

namespace LoadUserByToken {
  export type Params = {
    accessToken: string,
    role?: string
  }

  export type Result = {
    id: string
  }
}

class LoadUserByTokenSpy implements LoadUserByToken {
  params = {}
  result = {
    id: faker.datatype.uuid()
  } as LoadUserByToken.Result | null

  async load(params: LoadUserByToken.Params): Promise<LoadUserByToken.Result | null> {
    this.params = params
    return this.result
  }
}

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware,
  loadUserByTokenSpy: LoadUserByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadUserByTokenSpy = new LoadUserByTokenSpy()
  const sut = new AuthMiddleware(loadUserByTokenSpy, role)
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
    const role = 'any_role'
    const { sut, loadUserByTokenSpy } = makeSut(role)
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadUserByTokenSpy.params).toEqual({
      accessToken: httpRequest.accessToken,
      role
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
