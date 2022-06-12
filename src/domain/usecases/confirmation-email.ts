export interface ConfirmationEmail {
  confirm: (code: string) => Promise<ConfirmationEmail.Result>;
}

export namespace ConfirmationEmail {
  export type Result = boolean;
}
