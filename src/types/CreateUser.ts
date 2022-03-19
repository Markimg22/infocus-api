export interface CreateUser {
  create: (params: CreateUser.Params) => Promise<CreateUser.Result>
}

export namespace CreateUser {
  export type Params = {
    name: string,
    email: string,
    password: string,
  }

  export type Result = boolean
}
