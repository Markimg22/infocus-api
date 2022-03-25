export interface CreateTask {
  create: (params: CreateTask.Params) => Promise<CreateTask.Result>
}

export namespace CreateTask {
  export type Params = {
    title: string,
    description: string,
    isCompleted: boolean,
  }

  export type Result = void
}
