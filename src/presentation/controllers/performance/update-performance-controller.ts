import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'
import { UpdatePerformance } from '@/domain/usecases'

export class UpdatePerformanceController implements Controller {
  constructor(
    private readonly updatePerformance: UpdatePerformance
  ) {}

  async handle(request: UpdatePerformanceController.Request): Promise<HttpResponse> {
    try {
      const performanceUpdated = await this.updatePerformance.update(request)
      return ok(performanceUpdated)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace UpdatePerformanceController {
  export type Request = UpdatePerformance.Params
}
