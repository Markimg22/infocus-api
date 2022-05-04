export interface CheckUserByIdRepository {
  check: (id: string) => Promise<CheckUserByIdRepository.Result>;
}

export namespace CheckUserByIdRepository {
  export type Result = boolean;
}
