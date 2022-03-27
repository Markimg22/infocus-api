import { UpdateStatusTask } from '@/domain/usecases'
import { UpdateStatusTaskRepository } from '@/data/protocols/repositories'

export class DbUpdateStatusTask implements UpdateStatusTask {
  constructor(
    private readonly updateStatusTaskRepository: UpdateStatusTaskRepository
  ) {}

  async update(data: UpdateStatusTask.Params): Promise<UpdateStatusTask.Result> {
    await this.updateStatusTaskRepository.update(data)
  }
}
