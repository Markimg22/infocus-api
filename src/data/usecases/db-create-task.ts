import { CreateTask } from '@/domain/usecases';
import { CreateTaskRepository } from '@/data/protocols/repositories';

export class DbCreateTask implements CreateTask {
  constructor(private readonly createTaskRepository: CreateTaskRepository) {}

  async create(params: CreateTask.Params): Promise<CreateTask.Result> {
    await this.createTaskRepository.create(params);
  }
}
