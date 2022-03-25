import { CreateTask } from '@/domain/usecases'

export interface CreateTaskRespository {
  create: (params: CreateTaskRespository.Params) => Promise<CreateTaskRespository.Result>
}

export namespace CreateTaskRespository {
  export type Params = CreateTask.Params
  export type Result = CreateTask.Result
}
