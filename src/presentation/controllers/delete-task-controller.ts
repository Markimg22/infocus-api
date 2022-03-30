import { Controller, HttpResponse } from '@/presentation/protocols'
import { DeleteTask, LoadTasks } from '@/domain/usecases'
import { serverError, ok } from '@/presentation/helpers'

export class DeleteTaskController implements Controller {
  constructor(
    private readonly deleteTask: DeleteTask,
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: DeleteTaskController.Request): Promise<HttpResponse> {
    try {
      await this.deleteTask.delete(request)
      const tasks = await this.loadTasks.loadByUserId(request.userId)
      return ok(tasks)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace DeleteTaskController {
  export type Request = {
    id: string,
    userId: string
  }
}
