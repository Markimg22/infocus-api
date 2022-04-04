import { UpdateStatusTaskController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import {
  makeDbLoadTasks,
  makeDbUpdateStatusTask,
  makeUpdateStatusTaskValidation,
  makeDbUpdatePerformance
} from '@/main/factories'

export const makeUpdateStatusTaskController = (): Controller => {
  const controller = new UpdateStatusTaskController(
    makeUpdateStatusTaskValidation(),
    makeDbUpdateStatusTask(),
    makeDbLoadTasks(),
    makeDbUpdatePerformance()
  )
  return controller
}
