import { DeleteTask } from '@/domain/usecases'

export interface DeleteTaskRepository {
  delete: (data: DeleteTaskRepository.Params) => Promise<DeleteTaskRepository.Result>
}

export namespace DeleteTaskRepository {
  export type Params = DeleteTask.Params
  export type Result = DeleteTask.Result
}
