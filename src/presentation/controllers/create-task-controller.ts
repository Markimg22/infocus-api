import { CreateTask, LoadTasks } from '@/domain/usecases';
import { Controller, Validation, HttpResponse } from '@/presentation/protocols';
import { badRequest, serverError, ok } from '@/presentation/helpers';

export class CreateTaskController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createTask: CreateTask,
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(
    request: CreateTaskController.Request
  ): Promise<HttpResponse<LoadTasks.Result[]>> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);
      await this.createTask.create(request);
      const loadTasksResult = await this.loadTasks.loadByUserId(request.userId);
      return ok(loadTasksResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace CreateTaskController {
  export type Request = {
    userId: string;
    title: string;
    description: string;
    finished: boolean;
  };
}
