import { CreateUser, Validation, Authentication } from '@/types'

export class ValidationSpy implements Validation {
  // @ts-expect-error
  error: Error = null
  input = {}

  validate(input: any): Error {
    this.input = input
    return this.error
  }
}

export class CreateUserSpy implements CreateUser {
  result = true
  params = {} as CreateUser.Params

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    this.params = params
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params = {} as Authentication.Params

  async auth(params: Authentication.Params): Promise<void> {
    this.params = params
  }
}
