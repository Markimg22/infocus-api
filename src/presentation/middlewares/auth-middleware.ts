import { forbidden, ok, serverError } from '@/presentation/helpers'
import { Middleware, HttpResponse } from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadUserByToken } from '@/domain/usecases'

export class AuthMiddleware implements Middleware {
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

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
