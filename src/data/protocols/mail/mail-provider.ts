export interface MailProvider {
  send: (options: MailProvider.Options) => Promise<MailProvider.Result>;
}

export namespace MailProvider {
  export type Options = {
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  };

  export type Result = boolean;
}
