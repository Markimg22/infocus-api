export interface UpdateUserEmailConfirmatedRepository {
  update: (
    data: UpdateUserEmailConfirmatedRepository.Params
  ) => Promise<UpdateUserEmailConfirmatedRepository.Result>;
}

export namespace UpdateUserEmailConfirmatedRepository {
  export type Params = {
    id: string;
    emailConfirmated: boolean;
  };

  export type Result = boolean;
}
