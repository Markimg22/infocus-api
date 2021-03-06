import { HttpResponse, Controller, Validation } from '@/presentation/protocols';
import {
  LoadTasks,
  UpdatePerformance,
  UpdateStatusTask,
} from '@/domain/usecases';
import { serverError, ok, badRequest, forbidden } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';

export class UpdateStatusTaskController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateStatusTask: UpdateStatusTask,
    private readonly loadTasks: LoadTasks,
    private readonly updatePerformance: UpdatePerformance
  ) {}

  async handle(
    request: UpdateStatusTaskController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);
      const taskUpdated = await this.updateStatusTask.update(request);
      if (!taskUpdated) return forbidden(new InvalidParamError('id'));
      const { userId, finished } = request;
      await this.updatePerformance.update({
        userId,
        field: 'totalTasksFinished',
        value: finished ? 1 : -1,
      });
      const tasks = await this.loadTasks.loadByUserId(userId);
      return ok(tasks);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace UpdateStatusTaskController {
  export type Request = {
    id: string;
    userId: string;
    finished: boolean;
  };
}
