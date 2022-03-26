export interface UpdateStatusTask {
  update: (params: UpdateStatusTask.Params) => Promise<UpdateStatusTask.Result>
}

export namespace UpdateStatusTask {
  export type Params = {
    id: string,
    userId: string,
    status: boolean
  }

  export type Result = void
}
