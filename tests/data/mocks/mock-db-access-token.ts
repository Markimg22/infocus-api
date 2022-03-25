import { UpdateAccessTokenRepository } from '@/data/protocols/repositories'

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
