import { Controller, HttpResponse } from '@/presentation/protocols'
import { serverError, ok } from '@/presentation/helpers'
import { LoadTasks } from '@/domain/usecases'

export class LoadTasksController implements Controller {
  constructor(
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: LoadTasksController.Request): Promise<HttpResponse> {
    try {
      const tasks = await this.loadTasks.loadByUserId(request.userId)
      return ok(tasks)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadTasksController {
  export type Request = {
    userId: string
  }
}
