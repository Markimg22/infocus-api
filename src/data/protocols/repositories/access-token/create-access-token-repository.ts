export interface CreateAccessTokenRepository {
  create: (data: CreateAccessTokenRepository.Params) => Promise<CreateAccessTokenRepository.Result>
}

export namespace CreateAccessTokenRepository {
  export type Params = {
    id: string,
    token: string
  }

  export type Result = void
}
