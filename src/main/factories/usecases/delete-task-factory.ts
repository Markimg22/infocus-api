import { DbDeleteTask } from '@/data/usecases'
import { DeleteTask } from '@/domain/usecases'
import { makeRepositories } from '@/main/factories'

export const makeDbDeleteTask = (): DeleteTask => {
  const { deleteTaskRepository } = makeRepositories()
  return new DbDeleteTask(deleteTaskRepository)
}
