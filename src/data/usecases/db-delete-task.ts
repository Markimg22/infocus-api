import { DeleteTask } from '@/domain/usecases'
import { DeleteTaskRepository } from '@/data/protocols/repositories'

export class DbDeleteTask implements DeleteTask {
  constructor(
    private readonly deleteTaskRepository: DeleteTaskRepository
  ) {}

  async delete(params: DeleteTask.Params): Promise<DeleteTask.Result> {
    await this.deleteTaskRepository.delete(params)
  }
}
