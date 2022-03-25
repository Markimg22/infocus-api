import { UpdateAccessTokenRepository, CreateAccessTokenRepository, CheckAccessTokenRepository } from '@/data/protocols/repositories'

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

export class CheckAccessTokenRepositorySpy implements CheckAccessTokenRepository {
  id = ''
  result = true

  async check(id: string): Promise<boolean> {
    this.id = id
    return this.result
  }
}

export class CreateAccessTokenRepositorySpy implements CreateAccessTokenRepository {
  id = ''
  token = ''
  callsCount = 0

  async create(data: CreateAccessTokenRepository.Params): Promise<CreateAccessTokenRepository.Result> {
    this.id = data.userId
    this.token = data.token
    this.callsCount++
  }
}
