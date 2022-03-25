import { AuthenticationUser } from '@/domain/usecases'
import { HashComparer, Encrypter } from '@/data/protocols/cryptography'
import {
  LoadUserByEmailRepository,
  UpdateAccessTokenRepository,
  CheckAccessTokenRepository,
  CreateAccessTokenRepository
} from '@/data/protocols/repositories'

export class DbAuthenticationUser implements AuthenticationUser {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly createAccessTokenRepository: CreateAccessTokenRepository,
    private readonly checkAccessTokenRepository: CheckAccessTokenRepository
  ) {}

  async auth(params: AuthenticationUser.Params): Promise<AuthenticationUser.Result | null> {
    const { password, email } = params
    const user = await this.loadUserByEmailRepository.loadByEmail(email)
    if (user) {
      const isValid = await this.hashComparer.compare(password, user.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id)
        const accessTokenAlreadyExists = await this.checkAccessTokenRepository.check(user.id)
        if (accessTokenAlreadyExists) {
          await this.updateAccessTokenRepository.update(user.id, accessToken)
        } else {
          await this.createAccessTokenRepository.create({ id: user.id, token: accessToken })
        }
        return {
          accessToken,
          name: user.name
        }
      }
    }
    return null
  }
}
