export interface CheckAccessTokenRepository {
  check: (id: string) => Promise<CheckAccessTokenRepository.Result>
}

export namespace CheckAccessTokenRepository {
  export type Result = boolean
}
