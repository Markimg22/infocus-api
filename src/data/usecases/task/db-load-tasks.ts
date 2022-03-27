import { LoadTasks } from '@/domain/usecases'
import { LoadTasksRepository } from '@/data/protocols/repositories'

export class DbLoadTasks implements LoadTasks {
  constructor(
    private readonly loadTasksRepository: LoadTasksRepository
  ) {}

  async loadByUserId(userId: string): Promise<LoadTasks.Result[]> {
    const tasks = await this.loadTasksRepository.load(userId)
    return tasks
  }
}
