import { UpdateStatusTask } from '@/domain/usecases';
import { UpdateStatusTaskRepository } from '@/data/protocols/repositories';

export class DbUpdateStatusTask implements UpdateStatusTask {
  constructor(
    private readonly updateStatusTaskRepository: UpdateStatusTaskRepository
  ) {}

  async update(
    data: UpdateStatusTask.Params
  ): Promise<UpdateStatusTask.Result> {
    const taskUpdated = await this.updateStatusTaskRepository.update(data);
    return taskUpdated;
  }
}
