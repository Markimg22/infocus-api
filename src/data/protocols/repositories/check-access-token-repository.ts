export interface CheckAccessTokenRepository {
  check: (userId: string) => Promise<CheckAccessTokenRepository.Result>;
}

export namespace CheckAccessTokenRepository {
  export type Result = boolean;
}
