import { Decrypter } from '@/data/protocols/cryptography'
import { LoadUserByTokenRepository } from '@/data/protocols/repositories'
import { LoadUserByToken } from '@/domain/usecases'

export class DbLoadUserByToken implements LoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load(params: LoadUserByToken.Params): Promise<LoadUserByToken.Result | null> {
    const { accessToken } = params
    let token: string | null
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const user = await this.loadUserByTokenRepository.load({ accessToken })
      if (user) return user
    }
    return null
  }
}
