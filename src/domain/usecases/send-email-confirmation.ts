export interface SendEmailConfirmation {
  send: (
    params: SendEmailConfirmation.Params
  ) => Promise<SendEmailConfirmation.Result>;
}

export namespace SendEmailConfirmation {
  export type Params = {
    id: string;
    name: string;
    email: string;
  };

  export type Result = boolean;
}
