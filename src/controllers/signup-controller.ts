import {
  Controller,
  CreateUser,
  HttpResponse,
  Validation,
  Authentication
} from '@/types'
import { EmailInUseError } from '@/utils/errors'
import { badRequest, forbidden, ok, serverError } from '@/utils/helpers'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createUser: CreateUser,
    private readonly authentication: Authentication
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const isValid = await this.createUser.create({ name, email, password })
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const authenticationResult = await this.authentication.auth({ email, password })
      return ok(authenticationResult)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  }
}
