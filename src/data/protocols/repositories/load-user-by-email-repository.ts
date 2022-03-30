export interface LoadUserByEmailRepository {
  load: (email: string) => Promise<LoadUserByEmailRepository.Result | null>
}

export namespace LoadUserByEmailRepository {
  export type Result = {
    id: string,
    name: string,
    password: string
  }
}
