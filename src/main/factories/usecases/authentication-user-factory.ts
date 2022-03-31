import { DbAuthenticationUser } from '@/data/usecases'
import { AuthenticationUser } from '@/domain/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { env } from '@/main/config/env'
import { makeRepositories } from '@/main/factories'

export const makeDbAuthenticationUser = (): AuthenticationUser => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const {
    loadUserByEmailRepository,
    updateAccessTokenRepository,
    createAccessTokenRepository,
    checkAccessTokenRepository
  } = makeRepositories()
  return new DbAuthenticationUser(
    loadUserByEmailRepository,
    bcryptAdapter,
    jwtAdapter,
    updateAccessTokenRepository,
    createAccessTokenRepository,
    checkAccessTokenRepository
  )
}
