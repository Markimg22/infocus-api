import { DbUpdateStatusTask } from '@/data/usecases'
import { UpdateStatusTask } from '@/domain/usecases'
import { makeRepositories } from '@/main/factories'

export const makeDbUpdateStatusTask = (): UpdateStatusTask => {
  const { updateStatusTaskRepository } = makeRepositories()
  return new DbUpdateStatusTask(updateStatusTaskRepository)
}
