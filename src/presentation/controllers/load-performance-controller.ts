import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'
import { LoadPerformance } from '@/domain/usecases'

export class LoadPerformanceController implements Controller {
  constructor(
    private readonly loadPerformance: LoadPerformance
  ) {}

  async handle(request: LoadPerformanceController.Request): Promise<HttpResponse> {
    try {
      const performance = await this.loadPerformance.loadByUserId(request.userId)
      return ok(performance)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadPerformanceController {
  export type Request = {
    userId: string
  }
}
