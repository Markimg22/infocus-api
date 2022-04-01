import { UpdateStatusTaskController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import {
  makeDbLoadTasks,
  makeDbUpdateStatusTask,
  makeUpdateStatusTaskValidation
} from '@/main/factories'

export const makeUpdateStatusTaskController = (): Controller => {
  const controller = new UpdateStatusTaskController(
    makeUpdateStatusTaskValidation(),
    makeDbUpdateStatusTask(),
    makeDbLoadTasks()
  )
  return controller
}
