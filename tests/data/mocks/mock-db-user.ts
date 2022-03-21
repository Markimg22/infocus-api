import { CreateUserRepository, CheckUserByEmailRepository } from '@/data/protocols/repositories'

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
