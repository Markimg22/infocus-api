import { CreateTask } from '@/domain/usecases';

export interface CreateTaskRepository {
  create: (
    data: CreateTaskRepository.Params
  ) => Promise<CreateTaskRepository.Result>;
}

export namespace CreateTaskRepository {
  export type Params = CreateTask.Params;
  export type Result = CreateTask.Result;
}
