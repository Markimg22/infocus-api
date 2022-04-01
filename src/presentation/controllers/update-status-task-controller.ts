import { HttpResponse, Controller, Validation } from '@/presentation/protocols'
import { LoadTasks, UpdateStatusTask } from '@/domain/usecases'
import { serverError, ok, badRequest } from '@/presentation/helpers'

export class UpdateStatusTaskController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateStatusTask: UpdateStatusTask,
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: UpdateStatusTaskController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      await this.updateStatusTask.update(request)
      const tasks = await this.loadTasks.loadByUserId(request.userId)
      return ok(tasks)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace UpdateStatusTaskController {
  export type Request = {
    id: string,
    userId: string,
    finished: boolean
  }
}
