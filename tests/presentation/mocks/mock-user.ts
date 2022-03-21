import { CreateUser, AuthenticationUser } from '@/domain/usecases'

import faker from '@faker-js/faker'

export class CreateUserSpy implements CreateUser {
  result = true
  params = {} as CreateUser.Params

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    this.params = params
    return this.result
  }
}

export class AuthenticationUserSpy implements AuthenticationUser {
  params = {} as AuthenticationUser.Params
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName()
  } as AuthenticationUser.Result

  async auth(params: AuthenticationUser.Params): Promise<AuthenticationUser.Result> {
    this.params = params
    return this.result
  }
}
