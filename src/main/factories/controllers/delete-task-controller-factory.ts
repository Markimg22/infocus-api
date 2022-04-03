import { DeleteTaskController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbDeleteTask, makeDbLoadTasks } from '@/main/factories'

export const makeDeleteTaskController = (): Controller => {
  const controller = new DeleteTaskController(makeDbDeleteTask(), makeDbLoadTasks())
  return controller
}
