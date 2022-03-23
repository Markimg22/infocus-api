import { AuthenticationUser } from '@/domain/usecases'
import { LoadUserByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/repositories'
import { HashComparer, Encrypter } from '@/data/protocols/cryptography'

export class DbAuthenticationUser implements AuthenticationUser {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(params: AuthenticationUser.Params): Promise<AuthenticationUser.Result | null> {
    const { password, email } = params
    const user = await this.loadUserByEmailRepository.loadByEmail(email)
    if (user) {
      const isValid = await this.hashComparer.compare(password, user.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id)
        await this.updateAccessTokenRepository.update(user.id, accessToken)
        return {
          accessToken,
          name: user.name
        }
      }
    }
    return null
  }
}