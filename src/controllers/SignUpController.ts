import {
  Controller,
  CreateUser,
  HttpResponse,
  Validation,
  Authentication
} from '@/types'

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
        return {
          statusCode: 400
        }
      }
      const { name, email, password } = request
      const isValid = await this.createUser.create({ name, email, password })
      if (!isValid) {
        return {
          statusCode: 403
        }
      }
      await this.authentication.auth({ email, password })
      return {
        statusCode: 200
      }
    } catch (error) {
      return {
        statusCode: 500
      }
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
