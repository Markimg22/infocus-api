import { Controller, HttpResponse } from '@/presentation/protocols';
import { ok, serverError } from '@/presentation/helpers';
import { LoadPerformance, UpdatePerformance } from '@/domain/usecases';

export class UpdatePerformanceController implements Controller {
  constructor(
    private readonly updatePerformance: UpdatePerformance,
    private readonly loadPerformance: LoadPerformance
  ) {}

  async handle(
    request: UpdatePerformanceController.Request
  ): Promise<HttpResponse> {
    try {
      await this.updatePerformance.update(request);
      const performanceUpdated = await this.loadPerformance.loadByUserId(
        request.userId
      );
      return ok(performanceUpdated);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace UpdatePerformanceController {
  export type Request = UpdatePerformance.Params;
}
