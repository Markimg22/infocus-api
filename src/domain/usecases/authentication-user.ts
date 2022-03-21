export interface AuthenticationUser {
  auth: (params: AuthenticationUser.Params) => Promise<AuthenticationUser.Result>
}

export namespace AuthenticationUser {
  export type Params = {
    email: string,
    password: string,
  }

  export type Result = {
    accessToken: string,
    name: string,
  }
}
