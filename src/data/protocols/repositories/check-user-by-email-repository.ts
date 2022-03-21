export interface CheckUserByEmailRepository {
  check: (email: string) => Promise<CheckUserByEmailRepository.Result>
}

export namespace CheckUserByEmailRepository {
  export type Result = boolean
}
