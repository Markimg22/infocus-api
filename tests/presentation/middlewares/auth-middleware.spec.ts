import { forbidden } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/protocols'
import faker from '@faker-js/faker'

class AccessDeniedError extends Error {
  constructor() {
    super('Access denied')
    this.name = 'AccessDeniedError'
  }
}

class AuthMiddleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    const { accessToken } = request
    if (accessToken) {
      await this.loadAccountByToken.load({ accessToken, role: this.role })
    }
    return forbidden(new AccessDeniedError())
  }
}

namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

interface LoadAccountByToken {
  load: (params: LoadAccountByToken.Params) => Promise<LoadAccountByToken.Result | null>
}

namespace LoadAccountByToken {
  export type Params = {
    accessToken: string,
    role?: string
  }

  export type Result = {
    id: string
  }
}

class LoadAccountByTokenSpy implements LoadAccountByToken {
  params = {}
  result = {
    id: faker.datatype.uuid()
  } as LoadAccountByToken.Result | null

  async load(params: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result | null> {
    this.params = params
    return this.result
  }
}

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware,
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.params).toEqual({
      accessToken: httpRequest.accessToken,
      role
    })
  })

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
