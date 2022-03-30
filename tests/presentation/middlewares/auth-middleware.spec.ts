import { forbidden } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/protocols'

class AccessDeniedError extends Error {
  constructor() {
    super('Access denied')
    this.name = 'AccessDeniedError'
  }
}

class AuthMiddleware {
  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}

namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

type SutTypes = {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
