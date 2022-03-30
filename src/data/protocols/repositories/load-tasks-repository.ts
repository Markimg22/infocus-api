import { LoadTasks } from '@/domain/usecases'

export interface LoadTasksRepository {
  load: (userId: string) => Promise<LoadTasksRepository.Result>
}

export namespace LoadTasksRepository {
  export type Result = LoadTasks.Result[]
}
