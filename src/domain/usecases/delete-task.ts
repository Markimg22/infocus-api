export interface DeleteTask {
  delete: (params: DeleteTask.Params) => Promise<DeleteTask.Result>;
}

export namespace DeleteTask {
  export type Params = {
    id: string;
    userId: string;
  };

  export type Result = boolean;
}
