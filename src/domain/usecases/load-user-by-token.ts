export interface LoadUserByToken {
  load: (params: LoadUserByToken.Params) => Promise<LoadUserByToken.Result | null>
}

export namespace LoadUserByToken {
  export type Params = {
    accessToken: string,
  }

  export type Result = {
    id: string
  }
}
