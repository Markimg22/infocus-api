export interface CreateAccessTokenRepository {
  create: (
    data: CreateAccessTokenRepository.Params
  ) => Promise<CreateAccessTokenRepository.Result>;
}

export namespace CreateAccessTokenRepository {
  export type Params = {
    userId: string;
    token: string;
  };

  export type Result = void;
}
