import { DbLoadTasks } from '@/data/usecases'
import { LoadTasks } from '@/domain/usecases'
import { makeRepositories } from '@/main/factories'

export const makeDbLoadTasks = (): LoadTasks => {
  const { loadTasksRepository } = makeRepositories()
  return new DbLoadTasks(loadTasksRepository)
}
