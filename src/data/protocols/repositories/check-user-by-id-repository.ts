export interface CheckUserByIdRepository {
  load: (id: string) => Promise<CheckUserByIdRepository.Result>;
}

export namespace CheckUserByIdRepository {
  export type Result = boolean;
}
