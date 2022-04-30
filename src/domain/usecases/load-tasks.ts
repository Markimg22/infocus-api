export interface LoadTasks {
  loadByUserId: (userId: string) => Promise<LoadTasks.Result[]>;
}

export namespace LoadTasks {
  export type Result = {
    id: string;
    title: string;
    description: string;
    finished: boolean;
  };
}
