import { LoadUserByToken } from '@/domain/usecases'

export interface LoadUserByTokenRepository {
  load: (data: LoadUserByTokenRepository.Params) => Promise<LoadUserByTokenRepository.Result | null>
}

export namespace LoadUserByTokenRepository {
  export type Params = LoadUserByToken.Params
  export type Result = LoadUserByToken.Result
}
