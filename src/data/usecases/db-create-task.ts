import { CreateTask } from '@/domain/usecases'
import { CreateTaskRespository } from '@/data/protocols/repositories'

export class DbCreateTask implements CreateTask {
  constructor(
    private readonly createTaskRespository: CreateTaskRespository
  ) {}

  async create(params: CreateTask.Params): Promise<CreateTask.Result> {
    await this.createTaskRespository.create(params)
  }
}
