import { UpdateStatusTask } from '@/domain/usecases'

export interface UpdateStatusTaskRepository {
  update: (data: UpdateStatusTaskRepository.Params) => Promise<void>
}

export namespace UpdateStatusTaskRepository {
  export type Params = UpdateStatusTask.Params
  export type Result = UpdateStatusTask.Result
}
