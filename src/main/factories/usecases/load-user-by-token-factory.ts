import { DbLoadUserByToken } from '@/data/usecases'
import { LoadUserByToken } from '@/domain/usecases'
import { JwtAdapter } from '@/infra/cryptography'
import { env } from '@/main/config/env'
import { makeRepositories } from '../repositories'

export const makeDbLoadUserByToken = (): LoadUserByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const { loadUserByTokenRepository } = makeRepositories()
  return new DbLoadUserByToken(jwtAdapter, loadUserByTokenRepository)
}
