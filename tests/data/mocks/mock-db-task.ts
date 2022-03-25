import { CreateTaskRespository } from '@/data/protocols/repositories'
import { CreateTask } from '@/domain/usecases'

export class CreateTaskRespositorySpy implements CreateTaskRespository {
  params = {}

  async create(params: CreateTask.Params): Promise<CreateTask.Result> {
    this.params = params
  }
}
