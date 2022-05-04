export interface LoadUserByConfirmationCodeRepository {
  load: (code: string) => Promise<LoadUserByConfirmationCodeRepository.Result>;
}

export namespace LoadUserByConfirmationCodeRepository {
  export type Result = {
    id: string;
  };
}
