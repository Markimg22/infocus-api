import { CreateTask } from '@/domain/usecases'

export interface CreateTaskRespository {
  create: (params: CreateTask.Params) => Promise<CreateTask.Result>
}
