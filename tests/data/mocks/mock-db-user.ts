import {
  CreateUserRepository,
  CheckUserByEmailRepository,
  LoadUserByEmailRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols/repositories'

import faker from '@faker-js/faker'

export class CheckUserByEmailRepositorySpy implements CheckUserByEmailRepository {
  exists = false
  email = ''

  async check(email: string): Promise<CheckUserByEmailRepository.Result> {
    this.email = email
    return this.exists
  }
}

export class CreateUserRepositorySpy implements CreateUserRepository {
  params = {}
  result = true

  async create(data: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    this.params = data
    return this.result
  }
}

export class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
  email = ''
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  } as LoadUserByEmailRepository.Result | null

  async loadByEmail(email: string): Promise<LoadUserByEmailRepository.Result | null> {
    this.email = email
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id = ''
  token = ''
  callsCount = 0

  async update(id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    this.callsCount++
  }
}
