import { CreateUser, Authentication } from '@/domain/usecases'

import faker from '@faker-js/faker'

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
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName()
  } as Authentication.Result

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}
