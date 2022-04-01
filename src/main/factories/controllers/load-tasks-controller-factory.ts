import { LoadTasksController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadTasks } from '@/main/factories'

export const makeLoadTasksController = (): Controller => {
  const controller = new LoadTasksController(
    makeDbLoadTasks()
  )
  return controller
}
